'use strict'

const fs = use('fs')
const juice = use('juice')
const Mail = use('Mail')

module.exports = {
  generateMessage(view, data, template) {
    return view.render(template, data)
  },
  styleMessage(body)  {
    const css = fs.readFileSync('resources/assets/css/email.css', 'utf8')
    return juice.inlineContent(body, css)
  },
  async sendMessage(recipientEmail, recipientName, subject, body, attachments, embeds) {
    return await Mail.raw('', (message) => {
      message.html(body)
      message.subject(subject)
      message.to(recipientEmail, recipientName)
      message.from(process.env.MAIL_FROM_ADDRESS, process.env.MAIL_FROM_NAME)
      if (Array.isArray(attachments)) {
        for(let i = 0; i < attachments.length; i++) {
          message.attach(attachments[i].path, {
            filename: attachments[i].name
          })
        }
      }
      if (Array.isArray(embeds)) {
        for(let i = 0; i < embeds.length; i++) {
          message.embed(embeds[i].path, embeds[i].cid)
        }
      }
    })
  }
}