const orderMailTemplate = (
    user,
    menu,
    inviteLink,
    language = "vi"
) => {

    const isKo = language === "ko";

    return `

<!DOCTYPE html>
<html>

<head>
<meta charset="utf-8">
</head>

<body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:30px;">

<div style="max-width:600px;margin:auto;background:#fff;padding:40px;border-radius:10px;">

<h2 style="color:#2563eb;">
${isKo ? "🍱 주간 식단 안내" : "🍱 Thông báo mở đặt món"}
</h2>

<p>
${isKo ? "안녕하세요" : "Xin chào"} <strong>${user.name}</strong>,
</p>

<p>
${isKo
    ? `<strong>${menu.week}</strong> 주간 식단이 등록되었습니다.`
    : `Thực đơn <strong>${menu.week}</strong> đã được mở để đặt món.`}
</p>

<p>
${isKo
    ? "아래 버튼을 눌러 이번 주 식단을 확인하고 원하는 메뉴를 선택해 주세요."
    : "Vui lòng nhấn nút bên dưới để xem thực đơn và lựa chọn món ăn của bạn."}
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

${isKo ? "식단 보기" : "XEM THỰC ĐƠN"}

</a>

</div>

<p>
⏰
${isKo ? "주문 마감:" : "Hạn đặt món:"}
<strong>
${isKo ? "금요일 오후 5:00" : "17:00 Thứ Sáu"}
</strong>
</p>

<p>
${isKo
    ? "마감 시간이 지나면 시스템에서 자동으로 주문이 종료됩니다."
    : "Sau thời gian trên hệ thống sẽ tự động khóa việc đặt món."}
</p>

<hr>

<p style="font-size:12px;color:#888;">

${isKo
    ? "본 메일은 Food Ordering System에서 자동으로 발송되었습니다.<br>회신하지 말아 주세요."
    : "Email được gửi tự động từ hệ thống Food Ordering.<br>Vui lòng không trả lời email này."}

</p>

</div>

</body>

</html>

`;

};

module.exports = orderMailTemplate;