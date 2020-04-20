class Db {

    constructor(mongoose)
    {
        const questionSchema = new mongoose.Schema({
            title: String,
            question: String,
            comments: [{
                text: String,
                votes: Number
            }]
        });

        mongoose.set('useFindAndModify', false);

        this.questionModel = mongoose.model('Question', questionSchema);
    }

    async getQuestions() {
        try {
            return await this.questionModel.find({});
        } catch (error) {
            console.error("getQuestions:", error.message);
            return {};
        }
    }

    async getQuestion(id) {
        try {
            return await this.questionModel.findById(id);
        } catch(error) {
            console.error("getQuestion:", error.message);
            return {};
        }
    }

    async createQuestion(title, desc) {
        console.log(title, desc);
        const question = new this.questionModel({
           title: title,
            question: desc
        });
        try {
            let saveQuestion = await question.save();
            console.log("Saved question", saveQuestion);
        } catch (error) {
            console.error("createQuestion:", error.message);
            return {};
        }
    }

    async addAnswer(id, answer) {
        const newAnswer = {
            votes: 0,
            text: answer
        };
        try {
            await this.questionModel.findByIdAndUpdate({
                _id: id
            }, {
                $push: { comments: newAnswer}
            });
            return newAnswer;
        } catch (error) {
            console.error("addAnswer:", error.message);
            return {};
        }
    }

    async votes(answerId, vote) {
        let points = -1;
        if (vote === "up") {
            points = 1;
        }
        let comments = this.questionModel;
        await comments.updateOne({
            'comments._id': answerId
        }, {
            '$inc' : { 'comments.$.votes' : points }
        })
    }
}
module.exports = mongoose => new Db(mongoose);