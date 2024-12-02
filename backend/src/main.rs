mod models;
mod routes;
mod services;

use crate::routes::handlers::upload;

use actix_web::{App, HttpServer};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().service(upload))
        .bind("0.0.0.0:3000")?
        .run()
        .await
}