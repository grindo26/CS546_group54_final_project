const dbConnection = require("./config/mongoConnection");
const data = require("./data/");
const citiesData = data.citiesData;
const attractionsData = data.attractionsData;
const reviewsData = data.reviewsData;
const commentsData = data.commentsData;
const usersDataCode = data.usersDataCode;

async function main() {
    const db = await dbConnection.dbConnection();
    // await db.dropDatabase();
    try {
        const city = await citiesData.createCity("NYC", "New York", "USA", ["507f1f77bcf86cd799439078", "507f1f77bcf86cd799439079"], "54", "124");
        const attraction = await attractionsData.createAttraction(
            "Times Sqaure",
            "638a8f6ce67dd5e022456cfc",
            ["507f1f77bcf86cd799439066", "507f1f77bcf86cd799439019"],
            "4.5",
            "$$$",
            "https://t3.ftcdn.net/jpg/00/92/53/56/360_F_92535664_IvFsQeHjBzfE6sD4VHdO8u5OH USc6yHF.jpg",
            "https://g.page/central-park-ny?share"
        );
        const review = await reviewsData.createReview("507f1f77bcf86cd799438008", "507f1f77bcf86cd799439087", "4", "Times Square is amazing!");
        const id = review._id.toString();
        const comment = await commentsData.createComment("7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310", "I don't agree! It is too expensive!", id);
        const user = await usersData.createUser(
            "Test User",
            "User1",
            "testuser@abc.com",
            "20",
            "$2a$08$XdvNkfdNIL8F8xsuIUeSbNOFgK0M0iV5HOskfVn7.PWncShU.O",
            ["507f1f77bcf86cd799439087"],
            ["507f1f77bcf86cd799438011"],
            ["7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310"]
        );
        console.log("Done seeding database");
        await dbConnection.closeConnection();
    } catch (error) {
        console.log(error);
    }
}

main();
