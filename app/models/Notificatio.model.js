
var mongoose = require('mongoose');

var NotificationSchema = mongoose.Schema({
    NotificationType: { type : Number , required : true },
    UserId: { type : String , required : true },
    ResponseUserId: { type : String },
    SharedUserId: { type : String },
    SharedUserName: { type : String },
    FollowUserId: { type : String },
    FollowTopicId: { type : String },
    HighlightPostId: { type : String },
    HighlightPostType: { type : String },
    HighlightLikeId: { type : String },
    HighlightCommentId: { type : String },
    HighlightShareId: { type : String },
    CommentLikeId: { type : String },
    CommentText: { type : String },
    QuestionPostId: { type : String },
    QuestionRatingId: { type : String },
    QuestionRating: { type : String },
    QuestionTopic: { type : String },
    QuestionTopicId: { type : String },
    QuestionText: { type : String },
    QuestionShareId: { type : String },
    QuestionAnswerId: { type : String },
    AnswerRatingId: { type : String },
    AnswerRating: { type : String },
    AnswerTopic: { type : String },
    AnswerTopicId: { type : String },
    AnswerText: { type : String },
    ImpressionPostId: { type : String },
    ImpressionFolllowId: { type : String },
    Viewed: Number,
    NotificationDate: String
    }, 
    { timestamps: true }
);


var varNotification = mongoose.model('Notification', NotificationSchema, 'Notification');


module.exports = {
    Notification : varNotification
};

//Notification Type
    // 0 == Follow User
    // 1 == UnFollow User
    // 2 == New Topic
    // 3 == Follow Topic
    // 4 == UnFollow Topic
    // 5 == New Highlight Post
    // 6 == Highlight Post Like
    // 7 == Highlight Post Comment
    // 8 == Highlight Post Share
    // 9== New Question Post
    // 10 == Question Post Rating
    // 11 == Question Post Answer
    // 12 == Question Post Share
    // 13 == New Impression Post
    // 14 == Impression Follow
    // 15 == Comment Like
    // 16 == Answer Rating

    // 17 == Share HighlightPost For Followers Notify
    // 18 == Share HighlightPost For Followers Notify




//Viewed 
    // 0 == False
    // 1 == True