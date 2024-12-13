pub mod handlers;

use warp::{ Filter, body, multipart };

pub fn routes() -> impl warp::Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::post()
        .and(warp::path("nft-info"))
        .and(body::json())
        .and_then(handlers::nft_info) // handlers.rs에 정의된 함수 호출
    .or(warp::post()
        .and(warp::path("upload-gpx"))
        .and(multipart::form().max_length(10_000_000)) // 파일 크기 제한 (예: 10MB)
        .and_then(handlers::upload_and_parse_gpx)) // handlers.rs에 정의된 함수 호출
}