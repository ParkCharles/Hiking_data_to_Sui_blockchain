mod models;
mod routes;
mod services;

use warp::Filter;
use std::net::{ SocketAddr, IpAddr, Ipv4Addr };
use warp::http::Method;
use warp::http::header::HeaderName;

#[tokio::main]
async fn main() {
    // 서버 주소 설정
    let addr: SocketAddr = SocketAddr::new(IpAddr::V4(Ipv4Addr::new(127, 0, 0, 1)), 3000);

    // CORS 설정
    let cors = warp::cors()
        .allow_origin("http://localhost:5173")
        .allow_methods(vec![
            Method::POST,
            Method::GET,
            Method::PUT,
            Method::DELETE,
        ])  // 허용할 HTTP 메소드 설정
        .allow_headers(vec![
            HeaderName::from_static("content-type"),
        ]);  // 허용할 헤더 설정

    // 라우터 로드 및 필터 결합
    let routes = routes::routes()
        .with(cors)     // CORS 필터 적용
        .recover(|err: warp::Rejection| async move {
            eprintln!("Error occurred: {:?}", err);
            Ok::<_, std::convert::Infallible>(
                warp::reply::with_status(
                    "An error occurred",
                    warp::http::StatusCode::INTERNAL_SERVER_ERROR,
                ),
            )
        });

    // 서버 실행
    println!("Starting server at http://{}/", addr);
    warp::serve(routes).run(addr).await;
}