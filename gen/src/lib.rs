#[wasm_bindgen(js_name = "escapeHtml")]
pub fn escape_html(text: &str) -> String {
    let mut result = String::with_capacity(text.len());
    for c in text.chars() {
        match c {
            '&' => result.push_str("&amp;"),
            '<' => result.push_str("&lt;"),
            _ => result.push(c),
        }
    }
    result
}

use wasm_bindgen::prelude::wasm_bindgen;
