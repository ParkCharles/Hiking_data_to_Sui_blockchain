use std::fs::File;
use std::io::BufReader;
use gpx::{ read, Gpx };
use chrono::NaiveDateTime;

fn main() {
    // GPX 파일 열기
    let file = File::open("20241117_Surak.gpx").unwrap();
    let reader = BufReader::new(file);

    // GPX 파일 파싱
    let gpx: Gpx = read(reader).unwrap();

    // 첫 번째 트랙 가져오기
    let track = &gpx.tracks[0];

    // 트랙 이름 출력
    let track_name = track.name.as_ref().unwrap();
    println!("트랙 이름: {}", track_name);

    // 트랙의 각 웨이포인트에서 위도, 경도, 해발고도, 날짜/시간 출력
    for segment in &track.segments {
        for waypoint in &segment.points {
            let latitude = waypoint.point().x();    // 위도
            let longitude = waypoint.point().y();    // 경도
            let elevation = waypoint.elevation.unwrap_or(0.0).round() as i32;   // 고도 (값이 없는 경우 0.0으로 설정)
            
            // 
            if let Some(time) = &waypoint.time {
                // `Time` 객체의 format() 메서드 호출
                match time.format() {   // 날짜/시간: gpx::parser::time::Time 형식을 String으로 전환
                    Ok(formatted_time) => { // 형식이 잘못된 경우에 대응 (format 된 시간이 ISO 8601 형식이라면 그대로 출력)
                        let naive_datetime = NaiveDateTime::parse_from_str(&formatted_time, "%+").unwrap(); // String을 날짜 형식으로 변환
                        let formatted_time = naive_datetime.format("%Y-%m-%d %H:%M:%S");    // 간결한 형태인 2024-11-17 04:15:48 형식으로 변환

                        println!("위도: {}, 경도: {}, 해발고도: {}m, 시간: {}", latitude, longitude, elevation, formatted_time);
                    },
                    Err(e) => {
                        println!("Time formatting error: {:?}", e);
                    }
                }
            }
        }
    }
}