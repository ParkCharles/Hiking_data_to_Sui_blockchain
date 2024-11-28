// GPX 파일을 읽고, (100개의) 웨이포인트를 추출

use std::fs::File;
use std::io::BufReader;
use gpx::{ read, Gpx, Waypoint };
use serde_json::json;

// GPX 파일을 읽고, 모든 웨이포인트 중 100개를 추출해서 JSON 형태로 반환하는 함수
pub fn parse_gpx_to_waypoints(file_path: &str) -> Result<Vec<serde_json::Value>, String> {
    // GPX 파일 열기
    let file = File::open(file_path).map_err(|e| format!("파일 열기 실패: {}", e))?;
    let reader = BufReader::new(file);
    
    // GPX 파일 파싱
    let gpx: Gpx = read(reader).map_err(|e| format!("GPX 파싱 실패: {}", e))?;

    // 모든 포인트를 하나의 벡터로 통합
    let all_points: Vec<&Waypoint> = gpx
        .tracks
        .iter()
        .flat_map(|track| {
            track
                .segments
                .iter()
                .flat_map(|segment| {
                    segment.points.iter()
                })
        })
        .collect();

    let total_points = all_points.len();

    // 100등분한 인덱스 계산
    let step = if total_points > 100 {
        total_points / 100
    } else {
        1   // 데이터가 100개 이하라면 모든 포인트를 사용
    };

    // 100개의 웨이포인트 선택
    let mut waypoints = vec![];

    for i in (0..total_points).step_by(step).take(100) {
        let waypoint = &all_points[i];                                      // 0-based index로 접근
        let latitude = waypoint.point().x();                                       // 위도
        let longitude = waypoint.point().y();                                      // 경도
        let elevation = waypoint.elevation.unwrap_or(0.0).round() as u64;  // 고도 (값이 없는 경우 0.0으로 설정)

        // JSON 데이터 추가
        waypoints.push(json!({
            "latitude": latitude,
            "longitude": longitude,
            "elevation": elevation,
        }));
    }

    // 추출된 웨이포인트가 없다면 에러 반환
    if waypoints.is_empty() {
        return Err("웨이포인트가 없습니다.".to_string());
    }

    Ok(waypoints)
}