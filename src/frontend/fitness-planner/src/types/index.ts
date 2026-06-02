export type ScreenType = 'run' | 'schedule' | 'coach' | 'profile' | 'subscription';

export interface Message {
    id: number;
    role: 'user' | 'bot';
    text: string;
    sender?: string;
    planUpdate?: {
        title: string;
        action: string;
    };
}

export interface TrainingItem {
    title: string;
    type: string;
    duration: string;
    level: string;
    color?: string;
    img: string;
}
