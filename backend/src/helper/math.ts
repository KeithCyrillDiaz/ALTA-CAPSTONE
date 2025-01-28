


export const caclucateIncreasePercentage = (previousValue: number, currentValue: number) => {
    // CHECK IF PREV VALUE IS 0, IF YES RETURN 0
    if(previousValue === 0) return 0;
    const percentage = ((currentValue - previousValue) / previousValue) * 100;;
    return Math.ceil(percentage);
}