let validator = {
    set: function(obj, prop, value) {
        if(value === undefined) {
            obj[prop] = value;
            return true;
        }

        if (prop.startsWith('is') || prop.startsWith('had')) {
            value = !!value;
        } else if(prop === 'finishTime'){
            const pieces = value.split(':').map(_ => parseInt(_));

            if(pieces.length !== 3) {
                return false;
            }
            if(pieces.findIndex((x) => Number.isNaN(x)) !== -1) {
                return false;
            }
            const [hours, minutes, seconds] = pieces;
            if((minutes < 1 || minutes > 59) || (minutes < 1 || minutes > 59)) {
                return false;
            }
        } else {
            value = parseInt(value);
            if(Number.isNaN(value)) {
                return false;
            }
        }

        obj[prop] = value;
        obj.updateAdjustments();

        return true;
    }
};

class LifeAdjustedTime {
    constructor() {
        this.adjustments = [
            "isMarried", "minorChildren", "hoursWorked", "age", "poundsOverweight",
            "hadPlan", "trainingWeeks", "alcoholUnits", "hadPacer", "hadCoach",
            "attentionQuotient", "isEastAfrican", "medicationCount",
            "isDestinationRace", "isReligious", "isAttractive", "milesToRace",
            "maxRaceTemp"
        ];

        this.adjustments.forEach(a => this[a] = undefined);
        this.finishTime = undefined;
        this.finishTimeSeconds = undefined;
        this.adjustedTimeSeconds = undefined;
        this.currentAdjustments = {};
    }

    setCurrentAdjustment(adjustmentName) {
        if(this[adjustmentName] === undefined) {
            delete this.currentAdjustments[adjustmentName];
        } else {
            const adjustmentFunction = `${adjustmentName}Adjustment`;
            console.log('calling ', adjustmentFunction);
            const adjustment = this[adjustmentFunction]();
            this.currentAdjustments[adjustmentName] = adjustment;
        }
    }

    updateAdjustments() {
        if(!this.finishTimeSeconds){
            return false;
        }

        this.adjustments.forEach(a => this.setCurrentAdjustment(a));
        // Object.values(this.currentAdjustments).reduce((accumulator, currentValue) => accumulator + currentValue );
        return true;
    }

    percentageOf = (of, percent) => (percent / 100.0) * of;
    percentageOfBaseTime = (percentage) => this.percentageOf(this.finishTimeSeconds, percentage);

    /// eg. 3:45:00 -> 13500
    timeToSeconds(t) {
        const pieces = t.split(':').map(_ => parseInt(_));
        const [hours, minutes, seconds] = pieces;
        return (hours * 3600) + (minutes * 60) + seconds;
    }

    /// eg. 13500 -> 3:45:00
    secondsToTime(s) {
        let hoursPart = Math.floor(s / 3600).toString().padStart(2,'0');
        s -= (hoursPart * 3600);
        let minsPart = Math.floor(s / 60).toString().padStart(2,'0');
        let secondsPart = Math.floor(s % 60).toString().padStart(2,'0');

        return `${hoursPart}:${minsPart}:${secondsPart}`;
    }

    set finishTime(time) {
        if(time === undefined) {
            this.finishTimeSeconds = undefined;
        } else {
            this.finishTimeSeconds = this.timeToSeconds(time);
        }
    }

    isMarriedAdjustment = () => this.isMarried ? this.percentageOfBaseTime(-0.5) : this.percentageOfBaseTime(0.1)
    minorChildrenAdjustment = () => this.percentageOfBaseTime(-(this.minorChildren * 0.77))
    hoursWorkedAdjustment = () => this.percentageOfBaseTime(-(this.hoursWorked * 0.02))

    ageAdjustment() {
        if(this.age <= 30) {
            return this.percentageOfBaseTime(0.95);
        } else if(this.age <= 41) {
            return this.percentageOfBaseTime(0.25);
        } else if(this.age <= 50) {
            return this.percentageOfBaseTime(-0.75);
        } else if(this.age <= 60) {
            return this.percentageOfBaseTime(-1.25);
        } else if(this.age <= 70) {
            return this.percentageOfBaseTime(-2.25);
        } else if(this.age <= 110) {
            return this.percentageOfBaseTime(-4.25);
        }

        return 0;
    }

    poundsOverweightAdjustment = () => this.percentageOfBaseTime(-(this.poundsOverweight * 0.02))
    hadPlanAdjustment = () => this.hadPlan ? 0 : this.percentageOfBaseTime(-0.15)

    trainingWeeksAdjustment() {
        if(this.trainingWeeks <= 3) {
            return this.percentageOfBaseTime(-2.03);
        } else if(this.trainingWeeks <= 11) {
            return this.percentageOfBaseTime(-1.52);
        } else if(this.trainingWeeks <= 18) {
            return this.percentageOfBaseTime(-1.02);
        } else {
            return 0.00;
        }
    }

    alcoholUnitsAdjustment = () => this.percentageOfBaseTime(this.alcoholUnits * -0.07)
    hadPacerAdjustment = () => this.hadPacer ? this.percentageOfBaseTime(0.25) : 0
    hadCoachAdjustment = () => this.hadCoach ? this.percentageOfBaseTime(2.00) : 0

    attentionQuotientAdjustment() {
        if(this.attentionQuotient < 1) {
            return this.percentageOfBaseTime(-1.00);
        } else if(this.attentionQuotient <= 20) {
            return this.percentageOfBaseTime(0.5);
        } else if(this.attentionQuotient <= 50) {
            return this.percentageOfBaseTime(0.8);
        } else if(this.attentionQuotient <=75) {
            return this.percentageOfBaseTime(0.9);
        } else {
            return this.percentageOfBaseTime(1.01);
        }
    }

    isEastAfricanAdjustment = () => this.isEastAfrican ? this.percentageOfBaseTime(0.96) : 0
    medicationCountAdjustment = () => this.percentageOfBaseTime(this.medicationCount * -0.1)
    isDestinationRaceAdjustment = () => this.isDestinationRace ? this.percentageOfBaseTime(-0.5) : 0
    isReligiousAdjustment = () => this.isReligious ? this.percentageOfBaseTime(-1.0) : 0
    isAttractiveAdjustment = () => this.isAttractive ? this.percentageOfBaseTime(1.05) : 0

    milesToRaceAdjustment() {
        if(this.milesToRace < 500) {
            return 0;
        } else {
            return this.percentageOfBaseTime(-(this.milesToRace / 1000));
        }
    }

    maxRaceTempAdjustment() {
        if(this.maxRaceTemp < 55) {
            return 0.00;
        } else if(this.maxRaceTemp < 65) {
            return this.percentageOfBaseTime(-0.9);
        } else if(this.maxRaceTemp < 75) {
            return this.percentageOfBaseTime(-1.5);
        } else {
            return this.percentageOfBaseTime(-3.0);
        }
    }
}
