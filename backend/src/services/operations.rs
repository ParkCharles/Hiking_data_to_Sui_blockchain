// GPX 파일에서 추출된 웨이포인트 데이터를 후처리하고, 필요한 데이터 모델을 반환하는 역할

use crate::models::structs::Waypoint;
use crate::services::gpx::parse_gpx_to_waypoints;

pub fn process_gpx_file(file_path: &str) -> Result<Vec<Waypoint>, String> {
    // GPX 파일을 처리하여 웨이포인트 추출
    let waypoints_json = parse_gpx_to_waypoints(file_path)?;

    // 추출된 웨이포인트 데이터를 'Waypoint' 구조체로 변환
    let waypoints = waypoints_json.into_iter().map(|wp| {
        Waypoint {
            latitude: wp["latitude"].as_f64().unwrap_or(0.0),
            longitude: wp["longitude"].as_f64().unwrap_or(0.0),
            elevation: wp["elevation"].as_f64().unwrap_or(0.0),
            name: wp["name"].as_str().map(|s| s.to_string()),
        }
    }).collect();

    Ok(waypoints)
}