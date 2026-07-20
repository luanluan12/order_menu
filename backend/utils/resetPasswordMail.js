module.exports = (user, resetLink) => {
  const isKo = user.language === "ko";

  return `
        <!DOCTYPE html>

        <html>
        <head>
            <meta charset="utf-8">
        </head>

        <body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:30px;">

            <div style="
                max-width:650px;
                margin:auto;
                background:#fff;
                padding:40px;
                border-radius:12px;
            ">

                <h2 style="color:#16a34a;">
                    ${isKo ? "🔐 비밀번호 재설정" : "🔐 Đặt lại mật khẩu"}
                </h2>

                <p>
                    ${isKo ? "안녕하세요" : "Xin chào"}
                    <strong>${user.name}</strong>,
                </p>

                <p>
                    ${
                      isKo
                        ? "비밀번호 재설정을 요청하셨습니다."
                        : "Bạn đã yêu cầu đặt lại mật khẩu."
                    }
                </p>

                <p>
                    ${
                      isKo
                        ? "아래 버튼을 눌러 새 비밀번호를 설정하세요."
                        : "Nhấn nút bên dưới để đặt lại mật khẩu."
                    }
                </p>

                <p>
                    <a
                        href="${resetLink}"
                        style="
                            display:inline-block;
                            padding:12px 24px;
                            background:#16a34a;
                            color:#fff;
                            text-decoration:none;
                            border-radius:6px;
                            font-weight:bold;
                        "
                    >
                        ${isKo ? "비밀번호 재설정" : "Đặt lại mật khẩu"}
                    </a>
                </p>

                <p>
                    ${
                      isKo
                        ? "버튼이 작동하지 않으면 아래 링크를 사용하세요."
                        : "Nếu nút không hoạt động, hãy mở liên kết sau:"
                    }
                </p>

                <p>${resetLink}</p>

                <p>
                    <b>
                        ${
                          isKo
                            ? "이 링크는 15분 후 만료됩니다."
                            : "Liên kết này sẽ hết hạn sau 15 phút."
                        }
                    </b>
                </p>

                <p>
                    ${
                      isKo
                        ? "요청하지 않았다면 이 이메일을 무시하셔도 됩니다."
                        : "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này."
                    }
                </p>

            </div>

        </body>
        </html>
    `;
};
