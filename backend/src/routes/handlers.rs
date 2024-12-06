use std::path::Path;
use bytes::Buf;
use tokio::fs;
use warp::multipart::FormData;
use warp::{ reject, Rejection };
use serde_json::json;
use futures_util::stream::StreamExt;
use crate::models::structs::NftData;
use crate::services::gpx::parse_gpx_and_save_json;

use sui_sdk::rpc_types::SuiTransactionBlockResponse;
use sui_sdk::SuiClient;

// 공통 에러 핸들러 정의
#[derive(Debug)]
struct CustomError(String);

impl warp::reject::Reject for CustomError {}  // CustomError에 Reject 트레이트 구현

impl std::fmt::Display for CustomError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "Custom error: {}", self.0)
    }
}

// 디렉토리 생성 함수 (비동기)
async fn create_directory(directory: &str) -> Result<(), Rejection> {
    let base_directory = "data";
    let full_path = format!("{}/{}", base_directory, directory);
    if !Path::new(&full_path).exists() {
        // 디렉토리 생성 비동기 작업
        fs::create_dir_all(&full_path).await.map_err(|e| {
            eprintln!("Error creating directory: {:?}", e);
            warp::reject::custom(CustomError(format!(
                "Failed to create directory: {:?}",
                e
            )))
        })?;
    }
    Ok(())
}

// NFT 업로드 핸들러
pub async fn nft_info(nft_data: NftData) -> Result<impl warp::Reply, Rejection> {
    let nft_directory = "nft";

    // 공통 디렉토리 생성 함수 사용
    create_directory(nft_directory).await?;

    // NFT 정보를 JSON 파일로 저장 (data 폴더 안으로)
    let nft_file_path = format!("data/{}/{}.json", nft_directory, nft_data.name);
    let nft_info = json!({
        "name": nft_data.name,
        "description": nft_data.description,
        "url": nft_data.url,
        "wallet_address": nft_data.wallet_address,
    });

    // JSON 파일로 NFT 정보 저장
    fs::write(nft_file_path, nft_info.to_string())
        .await
        .map_err(|e| warp::reject::custom(CustomError(format!("Failed to save NFT: {:?}", e))))?;

    Ok(warp::reply::json(&json!({
        "status": "NFT uploaded successfully",
        "name": nft_data.name,
    })))
}


// GPX 파일 업로드 핸들러
pub async fn upload_and_parse_gpx(mut body: FormData) -> Result<impl warp::Reply, Rejection> {
    // FormData에서 "file" 필드 추출
    if let Some(Ok(field)) = body.next().await {
        if field.name() == "file" {
            let file_name = field.filename().unwrap_or("uploaded_gpx_file.gpx").to_string();
            let directory = "gpx";  // GPX 파일을 저장할 디렉토리

            // 디렉토리가 없으면 생성
            create_directory(directory).await?;

            // 파일 경로 설정 (data 폴더 안으로)
            let file_path = format!("data/{}/{}", directory, file_name);

            // 파일 내용을 Vec<u8>로 읽기
            let mut file_contents = Vec::new();
            let mut stream = field.stream();

            // 파일 내용을 읽어 file_contents에 저장
            while let Some(chunk) = stream.next().await {
                match chunk {
                    Ok(mut bytes) => {
                        // `copy_to_bytes(bytes.remaining())`를 사용하여 `Buf`에서 바이트 슬라이스를 추출
                        let byte_data = bytes.copy_to_bytes(bytes.remaining());
                        file_contents.extend_from_slice(&byte_data);
                    },
                    Err(e) => {
                        eprintln!("Error reading file chunk: {:?}", e);
                        return Err(warp::reject::custom(CustomError("Failed to read file".to_string())));
                    }
                }
            }

            // 파일 내용을 디스크에 저장
            fs::write(&file_path, file_contents).await.map_err(|e| {
                eprintln!("Error saving file: {:?}", e);
                reject::custom(CustomError(format!(
                    "Failed to save file: {:?}",
                    e
                )))
            })?;

            // GPX 파일 파싱 및 저장
            match parse_gpx_and_save_json(&file_path) {
                Ok(()) => {
                    let response = json!({
                        "fileName": file_name,
                        "filePath": file_path,
                        "status": "File uploaded and waypoints saved successfully"
                    });
                    Ok(warp::reply::json(&response))
                },
                Err(e) => {
                    eprintln!("GPX 파싱 실패: {}", e);
                    Err(warp::reject::custom(CustomError(format!("Failed to parse GPX: {}", e))))
                }
            }
        } else {
            Err(warp::reject::custom(CustomError("Invalid form data".to_string())))
        }
    } else {
        Err(warp::reject::custom(CustomError("Invalid form data".to_string())))
    }
}

