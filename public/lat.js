class LifeAdjustedTime {
    constructor(isMarried) {
        this.raceDistance = undefined;
        this.finishTime = undefined;
        this.finishTimeSeconds = undefined;
        this.isMarried = undefined;
        this.minorChildren = undefined;
        this.hoursWorked = undefined;
        this.age = undefined;
        this.poundsOverweight = undefined;
        this.hadPlan = undefined;
        this.trainingWeeks = undefined;
        this.alcoholUnits = undefined;
        this.hadPacer = undefined;
        this.hadCoach = undefined;
        this.attentionQuotient = undefined;
        this.isEastAfrican = undefined;
        this.medicationCount = undefined;
        this.destinationRace = undefined;
        this.isReligious = undefined;
        this.isAttractive = undefined;
        this.milesToRace = undefined;
        this.maxRaceTemp = undefined;

        this.valueMap = {
            finishTime: this.updateFinishTime,
            isMarried: this.isMarriedAdjustment,
        };

    }

    is(value) {
        return !(value === undefined || value === "no");
    }

    dispatch(name) {
        console.log(`updating ${name}`);
        if(this[name] === name) {
            console.log(`${name} unchanged`);
            return;
        }

        console.log(this.valueMap[name]);
    }

    updateValue(e) {
        const updatedValue = e.target.name;
        console.log('changed elem:', e);
        /// this[updatedValue] = e.target.value;
        this.dispatch(updatedValue);
    }

    adjustedTime() {
        if(!this.finishTimeseconds){
            return undefined;
        }

        return 1;
    }

    percentageOf(of, percent) {
        return (percent / 100.0) * of;
    }

    percentageOfBaseTime(percentage) {
        return this.percentageOf(this.finishTimeSeconds, percentage);
    }

    set updateFinishTime(time) {
        console.log('updating finish time to ', time);
    }

    isMarriedAdjustment = () => this.is(this.isMarried) ? this.percentageOfBaseTime(-0.5) : this.percentageOfBaseTime(0.1)
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

    poundsOverweightAdjustment = () => this.percentageOfBaseTime(-(self.poundsOverweight * 0.02))
    hadPlanAdjustent = () => this.is(this.hadPlan) ? 0 : this.percentageOfBaseTime(-0.15)
    trainingWeeks() {
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
    hadPacerAdjustment = () => this.is(this.hadPacer) ? this.percentageOfBaseTime(0.25) : 0
    hadCoachAdjustment = () => this.is(this.hadCoach) ? this.percentageOfBaseTime(2.00) : 0
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
    isEastAfrican = () => this.is(this.isEastafrican) ? this.percentageOfBaseTime(0.96) : 0
    medicationCountAdjustment = () => this.percentageOfBaseTime(this.medicationCount * -0.1)
    destinationRaceAdjustment = () => this.is(this.destinationRace) ? this.percentageOfBaseTime(-0.5) : 0
    isReligiousAdjustment = () => this.is(this.isReligious) ? this.percentageOfBaseTime(-1.0) : 0
    isAttractiveAdjustment = () => this.is(this.isAttractive) ? this.percentageOfBaseTime(1.05) : 0
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
