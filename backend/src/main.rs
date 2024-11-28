mod models;
mod routes;
mod services;
mod utils;

use actix_web::{App, HttpServer};
use actix_web::middleware::Logger;
use services::operations::process_gpx_file;
use sui_sdk::SuiClientBuilder;
use crate::models::structs::MintRequest;
use crate::utils::save_mint_request_as_json;
use crate::routes::handlers::init;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // SUI Devnet 클라이언트 초기화
    let sui_devnet = match SuiClientBuilder::default().build_devnet().await {
        Ok(client) => client,
        Err(err) => {
            eprintln!("Error building SUI client: {}", err);
            return Err(std::io::Error::new(std::io::ErrorKind::Other, err.to_string())); // 오류 변환
        }
    };

    println!("Sui devnet version: {}", sui_devnet.api_version());
    // GPX 파일 처리
    let input_file = "20241117_Surak.gpx";
    let waypoints = match process_gpx_file(input_file) {
        Ok(waypoints) => waypoints,
        Err(err) => {
            eprintln!("Error processing GPX file: {}", err);
            return Ok(());
        }
    };

    // MintRequest 데이터 하드코딩
    let mint_request = MintRequest {
        name: "Surak Hiking NFT".to_string(),
        description: "NFT representing a hiking trail at Surak Mountain".to_string(),
        url: "http://example.com/nft_metadata.json".to_string(),
        waypoints: waypoints.clone(),
        date: "2024-11-26".to_string(),
    };

    // 파일 경로 설정
    let file_path = "mint_request.json";

    // MintRequest 데이터를 JSON 파일로 저장
    match save_mint_request_as_json(&mint_request, file_path) {
        Ok(_) => println!("MintRequest saved successfully!"),
        Err(err) => eprintln!("Error saving MintRequest: {}", err),
    }

    // HTTP 서버 시작
    HttpServer::new(|| {
        App::new()
            .wrap(Logger::default()) // 로깅 미들웨어
            .configure(init) // 라우팅 설정
    })
    .bind("127.0.0.1:8080")? // 서버 포트 설정
    .run()
    .await
}