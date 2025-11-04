export function daysBetween(from: number, to: number) {
    return Array.from({ length: to - from + 1 }, (_, i) => i + from);
}

export function phase2Days(phases: string[], phaseMap: Record<string, number[]>, daysOfPhase?: number[]|number){
    // Get the day numbers from each phase
    return phases.flatMap(phase => {
        const phaseDays = phaseMap[phase] || []
        if(daysOfPhase===undefined) return phaseDays;
        if(Array.isArray(daysOfPhase)) return daysOfPhase.flatMap(day => phaseDays.at(day) ?? [])
        return phaseDays.at(daysOfPhase) ?? []
    });
}