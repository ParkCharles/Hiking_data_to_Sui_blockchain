// 사용자가 업로드한 GPX 파일의 유효성을 검사하고, 서버에 저장한 후 저장 경로를 반환

use actix_web::{web, HttpResponse, Responder};
use crate::utils::{validate_gpx_file, save_file};
use uuid::Uuid;

// init 함수 정의
pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.route("/", web::get().to(index)); // '/' 경로에 대한 라우트 설정
}

// 핸들러 함수
async fn index() -> impl Responder {
    HttpResponse::Ok().body("Hello, Actix Web!")
}

/// GPX 파일 업로드 핸들러
pub async fn upload_gpx_file(file: web::Bytes) -> impl Responder {
    // 파일 데이터를 받아온 후 문자열로 변환 (UTF-8)
    let file_content = match std::str::from_utf8(&file) {
        Ok(content) => content,
        Err(_) => return HttpResponse::BadRequest().body("Invalid file format."),
    };

    // 파일 유효성 검사
    if let Err(validation_error) = validate_gpx_file(file_content) {
        return HttpResponse::BadRequest().body(format!("Invalid GPX file: {}", validation_error));
    }

    // 파일 저장
    let file_name = format!("{}.gpx", Uuid::new_v4());    // 고유한 파일 이름 생성
    let save_result = save_file(&file, &file_name, "uploaded_files");   // 수정된 함수 호출
    
    match save_result {
        Ok(save_path) => HttpResponse::Ok().body(format!("File successfully uploaded and saved at: {}", save_path)),
        Err(save_error) => HttpResponse::InternalServerError().body(format!("File save error: {}", save_error)),
    }
}