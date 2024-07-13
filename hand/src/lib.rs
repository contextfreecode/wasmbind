#[no_mangle]
pub extern "C" fn escapeHtml(ptr: *const u8, len: usize) -> *mut VecInfo {
    let text = unsafe { std::slice::from_raw_parts(ptr, len) };
    let text = std::str::from_utf8(text).unwrap();
    let result = escape_html(text).as_bytes().to_vec();
    VecInfo::from_vec(result)
}

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

#[no_mangle]
pub extern "C" fn alloc(len: usize) -> *mut VecInfo {
    let vec = vec![0u8; len];
    VecInfo::from_vec(vec)
}

#[no_mangle]
pub extern "C" fn free(info: *mut VecInfo) {
    let vec = unsafe { Box::from_raw(info) };
    let _ = unsafe { Vec::from_raw_parts(vec.ptr, vec.len, vec.capacity) };
}

#[derive(Clone, Copy, Debug)]
#[repr(C)]
pub struct VecInfo {
    ptr: *mut u8,
    len: usize,
    capacity: usize,
}

impl VecInfo {
    pub fn from_vec(vec: Vec<u8>) -> *mut VecInfo {
        let mut vec = std::mem::ManuallyDrop::new(vec);
        let vec = VecInfo {
            ptr: vec.as_mut_ptr(),
            len: vec.len(),
            capacity: vec.capacity(),
        };
        Box::into_raw(Box::new(vec))
    }
}
