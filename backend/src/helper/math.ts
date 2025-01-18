


export const caclucateIncreasePercentage = (previousValue: number, currentValue: number) => {
    const percentage = ((currentValue - previousValue) / previousValue) * 100;
    return percentage;
}