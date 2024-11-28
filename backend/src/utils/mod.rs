use std::path::Path;
use std::fs;
use crate::models::structs::MintRequest;


// GPX 파일 유효성 검사
pub fn validate_gpx_file(file_name: &str) -> Result<(), String> {
    if !file_name.ends_with(".gpx") {
        return Err("Invalid file type. Only gpx files are allowed.".to_string());
    }
    Ok(())
}

// 파일 저장 함수
pub fn save_file(file_data: &[u8], file_name: &str, upload_dir: &str) -> Result<String, String> {
    // 디렉터리 생성
    if let Err(e) = fs::create_dir_all(upload_dir) {
        return Err(format!("Failed to create directory: {}", e));
    }
    
    // 파일 경로 생성
    let file_path = format!("{}/{}", upload_dir, file_name);
    let path = Path::new(&file_path);

    // 파일 저장
    if let Err(e) = fs::write(path, file_data) {
        return Err(format!("Failed to save file: {}", e));
    }

    Ok(file_path)
}

// 저장된 파일 삭제
pub fn delete_file(file_path: &str) -> Result<(), String> {
    std::fs::remove_file(file_path).map_err(|e| e.to_string())
}

// MintRequiest 데이터를 JSON 파일로 저장
pub fn save_mint_request_as_json(mint_request: &MintRequest, file_path: &str) -> Result<(), String> {
    match serde_json::to_string_pretty(mint_request) {
        Ok(json) => {
            fs::write(file_path, json).map_err(|e| e.to_string())?;
            println!("MintRequest saved to {}", file_path);
            Ok(())
        }
        Err(err) => Err(format!("Failed to serialize MintRequest: {}", err)),
    }
}