tinymce.init({
    selector: 'textarea[textarea-mce]',
    plugins: 'image',
    image_title: true,
    automatic_uploads: true,
    file_picker_types: 'image',
    // /admin/upload là link api bên phía admin, khi up ảnh lên tinymce sẽ chạy đến api này
    images_upload_url: '/admin/upload',
  });