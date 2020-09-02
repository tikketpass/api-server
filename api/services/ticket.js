const User = require("../models/user");
const HTTPError = require("node-http-error");

/**
 *
 * @param userId
 * @param option
 * @param option.expiredSize
 * @param option.unexpiredSize
 * @returns {Promise<*>}
 */
exports.getMyTickets = async function (userId, option) {
    try {
        const expiredSize = option.expiredSize;
        const unexpiredSize = option.unexpiredSize;

        const user = await User.findOne({ _id: userId });
        if(user === null) throw new HTTPError(404, "user not found");

        const tickets = await Promise.all(user.tickets.map(async ticket => {
            const _user = await User.findOne({ "concerts._id": ticket.concertId });
            const concert = _user.concerts.find(concert => concert._id == ticket.concertId);
            if(concert === null) throw new HTTPError(404, "concert not found");

            return {
                id: ticket._id,
                seatClass: ticket.seatClass,
                isUsed: ticket.isUsed,
                concert: {
                    id: concert._id,
                    name: concert.name,
                    startTime: concert.startTime,
                    endTime: concert.endTime,
                    startDate: concert.startDate,
                    spreadsheetLink: concert.spreadsheetLink,
                    topImageLink: concert.topImageLink,
                    bottomImageLink: concert.bottomImageLink
                },
                beginAt: new Date(`${concert.startDate}T${concert.startTime}`)
            }
        }));

        const now = Date.now()
        // find expired tickets
        let expiredTickets = tickets.filter(ticket => ticket.beginAt < now);
        expiredTickets.sort((e1, e2) => e2 - e1);
        expiredTickets = expiredTickets.map(ticket => {
            delete ticket.beginAt;
            return ticket;
        });
        // find unexipred tickets
        let unexpiredTickets = tickets.filter(ticket => ticket.beginAt >= now);
        unexpiredTickets.sort((e1, e2) => e1.beginAt - e2.beginAt)
        // find next ticket
        const nextTicket = unexpiredTickets[0] || null;
        delete nextTicket.beginAt;
        unexpiredTickets = unexpiredTickets.slice(1).map(ticket => {
            delete ticket.beginAt;
            return ticket;
        });

        if(expiredSize) expiredTickets = expiredTickets.slice(expiredTickets.length - expiredSize);
        if(unexpiredSize) unexpiredTickets = unexpiredTickets.slice(0, unexpiredSize);

        return {
            expiredTickets,
            unexpiredTickets,
            nextTicket
        }
    } catch (err) {
        throw err;
    }
}