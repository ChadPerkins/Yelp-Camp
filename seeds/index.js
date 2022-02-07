const mongoose = require('mongoose');
const axios = require('axios');

const {places, descriptors} = require('./seedHelpers');
const cities = require('./cities');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection;
db.on('error', console.log.bind(console, 'connection error:'));
db.once('open', () =>{
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    // Changed from 50 to 10 since the unsplash api limits 50/h.
    // Change back to 50 after development
    for (let i = 0; i < 10; i++) {
        const randNum = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            // Your user id
            author: '61fd764abf36693869885953',
            images : [
                {
                    url :'https://res.cloudinary.com/dcagbhmvd/image/upload/v1644080888/YelpCamp/ifod1tx7yn2wvvjdtzoz.webp',
                    filename: "YelpCamp/ifod1tx7yn2wvvjdtzoz"
                },
                {
                    url : 'https://res.cloudinary.com/dcagbhmvd/image/upload/v1644080888/YelpCamp/a80lxczvcqesteaqkbwr.jpg',
                    filename : "YelpCamp/a80lxczvcqesteaqkbwr"
                },
                {
                    url: 'https://res.cloudinary.com/dcagbhmvd/image/upload/v1644080888/YelpCamp/vosffynbp2ohtmft4xdv.jpg',
                    filename : "YelpCamp/vosffynbp2ohtmft4xdv"
            }
            ],
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [-113.1331, 47.0202]
            },
            location: `${cities[randNum].city}, ${cities[randNum].state}`,
            description: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolorum quasi ipsum sit. Distinctio vel ut nisi a quisquam ullam quas nulla obcaecati fugit repudiandae? Hic voluptates perferendis accusantium natus a!
            Atque, dicta quod? Cum at nostrum accusantium temporibus impedit eaque, nulla consectetur est voluptates reprehenderit ea suscipit porro. Placeat pariatur exercitationem modi ex voluptate tenetur. Quo tenetur corporis fuga eos.
            Soluta, consequatur quisquam possimus unde earum cupiditate doloremque, deserunt natus reiciendis magnam harum esse in quasi modi omnis. Dolorem id eaque debitis fuga officia tenetur illum laborum repudiandae optio vitae.`,
            price
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})