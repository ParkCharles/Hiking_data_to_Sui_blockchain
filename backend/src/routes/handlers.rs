use actix_web::{post, web, Responder};
use std::fs;
use serde_json::json;
use crate::services::gpx;
use crate::models::structs::NFTRequest;

#[post("/upload")]
async fn upload(
    req: web::Json<NFTRequest>,
    file: web::Bytes,
) -> impl Responder {
    let file_path = "/tmp/uploaded.gpx";

    // 파일 저장
    if let Err(e) = fs::write(file_path, &file) {
        return web::Json(json!({ "error": format!("파일 저장 실패: {}", e) }));
    }

    // GPX 파일 파싱
    match gpx::parse_gpx_to_waypoints(file_path) {
        Ok(waypoints) => {
            // TODO: SUI NFT 민팅 로직 추가
            web::Json(json!({ "txId": "dummy-tx-id" }))
        }
        Err(err) => web::Json(json!({ "error": err })),
    }
}