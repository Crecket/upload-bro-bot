// example code

// send the message
super.sendMessage(msg.chat.id, message, {
    parse_mode: "HTML",
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: "Help - More specific help",
                    url: "/help"
                },
            ], [
                {
                    text: "Login",
                    callback_data: "cb_data"
                },
            ],
        ]
    }
})
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {

        console.log(err);
    });