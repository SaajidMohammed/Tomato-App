import mongoose  from "mongoose";

export const connectDB = async() => {
    await mongoose.connect('mongodb+srv://saajidmohammed6:MdSaajid0005@cluster0.19ypawj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(()=>console.log("DB Connected"));
}

