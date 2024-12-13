use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct NftData {
    pub name: String,
    pub description: String,
    pub url: String,
    pub wallet_address: String,
}

// GPX 파일의 데이터 구조체
#[derive(Debug, Serialize, Deserialize)]
pub struct GpxData {
    pub file_path: String,
    pub file_name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Waypoint {
    pub latitude: f64,              // 위도
    pub longitude: f64,             // 경도
    pub elevation: f64,             // 해발고도
}