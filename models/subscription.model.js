import mongoose  from "mongoose";
import User from "./user.model.js";
import dayjs from 'dayjs'


const subscriptionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    price:{ 
        type: Number,
        required: [true, 'Subscription price is required'],
        trim: true,
        min: [0, 'Price must be greater than 0'],
        max: [1000, 'Price must be less than 1000']
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'],
        default: 'USD'
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    category: {
        type: String,
        enum: ['sports', 'news', 'entertainment', 'lifestyle','technology', 'finance', 'politics', 'other']
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active',
        index: true
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start date must be in the past'
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function(value){
                return value > this.startDate;
            },
            message: 'Renewal Date must be after the start date'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
        index: true,

    },
    cancelledAt: {
      type: Date,
      default: null,
      index: true,
    },
    
},{timestamps: true})

const frequencyMap = {
  daily: 'day',
  weekly: 'week',
  monthly: 'month',
  yearly: 'year',
};

// Auto-calculate renwewal date if it is missing
subscriptionSchema.pre('save', function(next){

    const frequencyChanged = this.isModified('frequency');
    const startDateChanged = this.isModified('startDate');
    const renewalDateManuallyChanged = this.isModified('renewalDate');

    console.log(
  'startDate modified?',
  this.isModified('startDate'),
  'frequency modified?',
  this.isModified('frequency')
);

    // const renewalPeriods = {
    //         daily: 1,
    //         weekly: 7,
    //         monthly: 30,
    //         yearly: 365, 
    //     };

    if (frequencyChanged || startDateChanged || !this.renewalDate) {
    
    const unit = frequencyMap[this.frequency];

    this.renewalDate = dayjs(this.startDate)
      .add(1, unit)
      .toDate();
  }
    // this.renewalDate = new Date(this.startDate)
    // this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
  
 

        // this.renewalDate = new Date(this.startDate)
        // this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    
        // jan 1st
        // renewal frequency is monthly, monthly = 30 days
        // Therefore, renewal date is set to Jan 31st
    
    


    // Auto-update the status if renewal date has passed
    // here new date is the current date
    if (this.renewalDate < new Date()){
        this.status = 'expired';
    }

    // save this in the database
    next()
})
// This pre function acts like a middleware in a way
// coz it went through a step before going to a new process
// and then continued with that step


const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
