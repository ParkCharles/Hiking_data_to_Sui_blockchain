use serde::{Deserialize};

#[derive(Deserialize)]
pub struct NFTRequest {
    name: String,
    description: String,
    url: String,
    wallet: String,
}