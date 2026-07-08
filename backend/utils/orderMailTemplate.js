const orderMailTemplate = (

    user,

    menu,

    inviteLink

) => {

    return `

<!DOCTYPE html>
<html>

<head>
<meta charset="utf-8">
</head>

<body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:30px;">

<div style="max-width:600px;margin:auto;background:#fff;padding:40px;border-radius:10px;">

<h2 style="color:#2563eb;">
🍱 Thông báo mở đặt món
</h2>

<p>
Xin chào <strong>${user.name}</strong>,
</p>

<p>
Thực đơn <strong>${menu.week}</strong> đã được mở để đặt món.
</p>

<p>
Vui lòng nhấn nút bên dưới để xem thực đơn và lựa chọn món ăn của bạn.
</p>

<div style="margin:40px 0;text-align:center;">

<a
href="${inviteLink}"
style="
display:inline-block;
padding:15px 40px;
background:#2563eb;
color:#fff;
text-decoration:none;
border-radius:8px;
font-size:18px;
font-weight:bold;
"
>

XEM THỰC ĐƠN

</a>

</div>

<p>
⏰ Hạn đặt món:
<strong>17:00 Thứ Sáu</strong>
</p>

<p>
Sau thời gian trên hệ thống sẽ tự động khóa việc đặt món.
</p>

<hr>

<p style="font-size:12px;color:#888;">

Email được gửi tự động từ hệ thống Food Ordering.<br>

Vui lòng không trả lời email này.

</p>

</div>

</body>

</html>

`;

};

module.exports = orderMailTemplate;