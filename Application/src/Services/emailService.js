const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your_email@gmail.com',
        pass: 'your_app_password'
    }
})

const sendReportEmail = async (report) => {

    await transporter.sendMail({
        from: 'your_email@gmail.com',
        to: 'admin@campusexchange.com', // HARD CODED
        subject: 'Listing Report Submitted',
        text: `
        Listing ID: ${report.listingId}
        Reported By: ${report.reportedBy}
        Reason: ${report.reason}
        `
    })

}

module.exports = { sendReportEmail }