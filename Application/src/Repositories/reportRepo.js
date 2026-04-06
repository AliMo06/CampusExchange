const db = require('../../../Data/db')
const { sendReportEmail } = require('../Services/emailService')

class ReportRepository {

    async createReport(data) {

        const query = `
        INSERT INTO reports (listing_id, reported_by, reason, status)
        VALUES ($1,$2,$3,'pending')
        RETURNING *
        `

        const result = await db.query(query, [
            data.listingId,
            data.reportedBy,
            data.reason
        ])

        const report = result.rows[0]

        // send email
        await sendReportEmail({
            listingId: report.listing_id,
            reportedBy: report.reported_by,
            reason: report.reason
        })

        return report
    }

}

module.exports = new ReportRepository()