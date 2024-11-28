use serde::{Deserialize, Serialize};

// 업로드될 gpx 파일에 대한 구조체
#[derive(Debug, Serialize, Deserialize)]
pub struct UploadedFile {
    pub file_name: String,          // 파일 이름
    pub upload_time: String,        // 업로드 시각 (ISO 8601 형식 권장)
    pub file_size: u64,             // 파일 크기 (바이트 단위)
    pub file_path: String,          // 서버에 저장된 파일 경로
    pub waypoints: Vec<Waypoint>,   // GPX에서 추출된 웨이포인트들
}

// Waypoint 구조체 (GPS 데이터를 담을 구조체)
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Waypoint {
    pub latitude: f64,              // 위도
    pub longitude: f64,             // 경도
    pub elevation: f64,             // 해발고도
    pub name: Option<String>,       // 이름 (특징)
}

// MintRequest 구조체 (NFT 발행에 필요한 데이터)
#[derive(Debug, Serialize, Deserialize)]
pub struct MintRequest {
    pub name: String,               // NFT 이름
    pub description: String,        // NFT 설명 (등산경로에 대한 설명)
    pub url: String,                // 외부 리소스 url
    pub waypoints: Vec<Waypoint>,   // GPX 데이터에서 추출한 경로 데이터
    pub date: String,               // 기록 날짜 (ISO 8601 형식 추천)
}