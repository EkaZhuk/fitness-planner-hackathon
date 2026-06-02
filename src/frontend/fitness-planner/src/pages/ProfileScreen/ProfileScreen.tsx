// import React from 'react';
import { User, ArrowRight } from 'lucide-react';
import React, {useState, useEffect} from 'react';
import {useScheduleStore} from '../../store/scheduleStore';
import {apiService} from "@/src/services/api.service.ts";
import useGoalStore from '../../store/goalStore';
interface ProfileScreenProps {
    onUpgradePress: () => void;
}



export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onUpgradePress }) => {
    const [currentKm, setCurrentKm] = useState<number>(0);
    const [point, setPoint] = useState<number>(0);
    const [sumDistanceKm, setSumDistanceKm] = useState<number>(0);

    const [currentProgress, setCurrentProgress] = useState<{
        current_distance_km: number;
        sum_distance_km: number,
        point: number
    } | null>(null);
    const {saveGoal, loadGoal, goal, error, clearGoal} = useGoalStore();
    const [formData, setFormData] = useState({goal_km: 0, goal_deadline: ''});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoalLoading, setIsGoalLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [trainingCompleted, setTrainingCompleted] = useState(false);
    const [isTrainingBlockVisible, setIsTrainingBlockVisible] = useState(true);
    const [trainingStatus, setTrainingStatus] = useState(null);



    const loadProgress = async () => {
        try {
            const progress = await apiService.getProgress();
            if (progress && progress.current_distance_km !== undefined) {
                setCurrentProgress(progress);
                setCurrentKm(progress.current_distance_km);
                setPoint(progress.point);
                setSumDistanceKm(progress.sum_distance_km);
            } else {
                const zeroProgress = {
                    current_distance_km: 0,
                    sum_distance_km: 0,
                    point: 0
                };
                setCurrentProgress(zeroProgress);
                setCurrentKm(0);
                setPoint(0);
                setSumDistanceKm(0);
            }
        } catch (error) {
            console.log('No progress found');
            const zeroProgress = {
                current_distance_km: 0,
                sum_distance_km: 0,
                point: 0
            };
            setCurrentProgress(zeroProgress);
            setCurrentKm(0);
            setPoint(0);
            setSumDistanceKm(0);
        }
    };

    useEffect(() => {
        const loadAllData = async () => {
            setIsLoading(true);
            await Promise.all([
                loadProgress(),
                loadGoal()
            ]);
            setIsLoading(false);
        };

        loadAllData();
    }, []);




    return (
        <div className="pt-32 px-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-surface-lvl2 border-2 border-primary p-1 rounded-full mb-6">
                <div className="w-full h-full bg-surface-lvl1 rounded-full flex items-center justify-center">
                    <User size={48} className="text-primary" />
                </div>
            </div>
            <h2 className="text-3xl font-black italic">Профиль</h2>
            <p className="text-white/40 font-bold uppercase text-xs tracking-widest mt-1 mb-8">
                Блок подготовки
            </p>

            <div className="w-full grid grid-cols-2 gap-4 mb-8">
                <div className="bg-surface-lvl1 p-4 rounded-soft border border-surface-border text-left">
                    <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-1">
                        ТЕКУЩИЙ РАНГ
                    </p>
                    <p className="font-sans font-black italic text-xl text-primary">Начинающий</p>
                </div>
                <div className="bg-surface-lvl1 p-4 rounded-soft border border-surface-border text-left">
                    <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-1">
                        ОБЩИЙ КИЛОМЕТРАЖ
                    </p>
                    <p className="font-sans font-black italic text-xl">{sumDistanceKm}</p>
                </div>
            </div>

            <div className="w-full space-y-2">
                <button
                    onClick={onUpgradePress}
                    className="w-full bg-primary text-black py-4 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 rounded-soft"
                >
                    ПОВЫСИТЬ ПЛАН <ArrowRight size={14} />
                </button>
                <button className="w-full bg-surface-lvl1 text-white py-4 font-black uppercase tracking-widest text-xs border border-surface-border rounded-soft">
                    НАСТРОЙКИ
                </button>
            </div>
        </div>
    );
};
