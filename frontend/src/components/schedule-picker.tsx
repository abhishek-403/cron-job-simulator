// import { forwardRef, useImperativeHandle, useState } from "react";
// import { Checkbox } from "./ui/checkbox";
// import { Label } from "./ui/label";
// import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

// const daysOfWeek = [
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
//   "Sunday",
// ];
// const months = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];

// type SchedulePickerProps = {
//   initialMode?: string;
//   initialValues?: {
//     everyMinutes?: number;
//     dailyTime?: string;
//     monthlyDay?: number;
//     monthlyTime?: string;
//     yearlyDay?: number;
//     yearlyMonth?: string;
//     yearlyTime?: string;
//     days?: number[];
//     weekdays?: string[];
//     selectedMonths?: string[];
//     hours?: number[];
//     minutes?: number[];
//   };
//   onSubmit: (data: any) => void;
// };
// export type SchedulePickerHandle = {
//   submit: () => void;
// };

// const SchedulePicker = forwardRef<SchedulePickerHandle, SchedulePickerProps>(
//   ({ initialMode = "minutes", initialValues = {}, onSubmit }, ref) => {
//     const [mode, setMode] = useState(initialMode);
//     const [everyMinutes, setEveryMinutes] = useState(
//       initialValues.everyMinutes ?? 1
//     );
//     const [dailyTime, setDailyTime] = useState(
//       initialValues.dailyTime ?? "00:00"
//     );
//     const [monthlyDay, setMonthlyDay] = useState(initialValues.monthlyDay ?? 1);
//     const [monthlyTime, setMonthlyTime] = useState(
//       initialValues.monthlyTime ?? "00:00"
//     );
//     const [yearlyDay, setYearlyDay] = useState(initialValues.yearlyDay ?? 1);
//     const [yearlyMonth, setYearlyMonth] = useState(
//       initialValues.yearlyMonth ?? "January"
//     );
//     const [yearlyTime, setYearlyTime] = useState(
//       initialValues.yearlyTime ?? "00:00"
//     );
//     const [days, setDays] = useState<number[]>(initialValues.days ?? []);
//     const [weekdays, setWeekdays] = useState<string[]>(
//       initialValues.weekdays ?? []
//     );
//     const [selectedMonths, setSelectedMonths] = useState<string[]>(
//       initialValues.selectedMonths ?? []
//     );
//     const [hours, setHours] = useState<number[]>(initialValues.hours ?? []);
//     const [minutes, setMinutes] = useState<number[]>(
//       initialValues.minutes ?? []
//     );

//     const toggle = (value: any, setFunc: Function, arr: any[]) => {
//       setFunc(
//         arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
//       );
//     };

//     const handleSubmit = () => {
//       const data = {
//         mode,
//         everyMinutes,
//         dailyTime,
//         monthlyDay,
//         monthlyTime,
//         yearlyDay,
//         yearlyMonth,
//         yearlyTime,
//         days,
//         weekdays,
//         selectedMonths,
//         hours,
//         minutes,
//       };
//       onSubmit(data);
//     };

//     useImperativeHandle(ref, () => ({
//       submit: handleSubmit,
//     }));

//     return (
//       <div className="max-w-2xl mx-auto p-4 border rounded-lg bg-white shadow">
//         <h2 className="text-lg font-semibold mb-4">Execution schedule</h2>

//         <RadioGroup
//           value={mode}
//           onValueChange={setMode}
//           className="mb-4 space-y-2 text-black"
//         >
//           <div className="flex gap-2 items-center">
//             <RadioGroupItem value="minutes" id="every-min" />
//             <Label htmlFor="every-min">
//               Every{" "}
//               <input
//                 type="number"
//                 min={1}
//                 max={60}
//                 className="w-16 mx-2 py-0.5 border rounded disabled:bg-gray-100 disabled:text-gray-500"
//                 disabled={mode !== "minutes"}
//                 value={everyMinutes}
//                 onChange={(e) => setEveryMinutes(Number(e.target.value))}
//               />
//               minute(s)
//             </Label>
//           </div>
//           <div className="flex gap-2 items-center">
//             <RadioGroupItem value="daily" id="every-day" />
//             <Label htmlFor="every-day">
//               Every day at
//               <input
//                 type="time"
//                 className="w-32 mx-2 py-0.5 border rounded disabled:bg-gray-100 disabled:text-gray-500"
//                 disabled={mode !== "daily"}
//                 value={dailyTime}
//                 onChange={(e) => setDailyTime(e.target.value)}
//               />
//             </Label>
//           </div>
//           <div className="flex gap-2 items-center">
//             <RadioGroupItem value="monthly" id="every-month" />
//             <Label htmlFor="every-month">
//               Every
//               <input
//                 type="number"
//                 min={1}
//                 max={31}
//                 className="w-16 mx-2 py-0.5 border rounded disabled:bg-gray-100 disabled:text-gray-500"
//                 disabled={mode !== "monthly"}
//                 value={monthlyDay}
//                 onChange={(e) => setMonthlyDay(Number(e.target.value))}
//               />
//               of the month at
//               <input
//                 type="time"
//                 className="w-32 mx-2 py-0.5 border rounded disabled:bg-gray-100 disabled:text-gray-500"
//                 disabled={mode !== "monthly"}
//                 value={monthlyTime}
//                 onChange={(e) => setMonthlyTime(e.target.value)}
//               />
//             </Label>
//           </div>
//           <div className="flex gap-2 items-center">
//             <RadioGroupItem value="yearly" id="every-year" />
//             <Label htmlFor="every-year">
//               Every year on
//               <input
//                 type="number"
//                 min={1}
//                 max={31}
//                 className="w-16 mx-2 py-0.5 border rounded disabled:bg-gray-100 disabled:text-gray-500"
//                 disabled={mode !== "yearly"}
//                 value={yearlyDay}
//                 onChange={(e) => setYearlyDay(Number(e.target.value))}
//               />
//               <select
//                 disabled={mode !== "yearly"}
//                 className="mx-2 border rounded py-0.5 disabled:bg-gray-100 disabled:text-gray-500"
//                 value={yearlyMonth}
//                 onChange={(e) => setYearlyMonth(e.target.value)}
//               >
//                 {months.map((m) => (
//                   <option key={m}>{m}</option>
//                 ))}
//               </select>
//               at
//               <input
//                 type="time"
//                 className="w-32 mx-2 py-0.5 border rounded disabled:bg-gray-100 disabled:text-gray-500"
//                 disabled={mode !== "yearly"}
//                 value={yearlyTime}
//                 onChange={(e) => setYearlyTime(e.target.value)}
//               />
//             </Label>
//           </div>

//           <div className="flex gap-2 items-center">
//             <RadioGroupItem value="custom" id="custom" />
//             <Label htmlFor="custom">Custom</Label>
//           </div>
//         </RadioGroup>

//         {mode === "custom" && (
//           <div className="scrollbar-thin-custom grid grid-cols-3 gap-4 bg-gray-0 rounded p-3 border mt-2">
//             <div>
//               <div className="text-xs font-medium mb-1">Days of month</div>
//               <div className="flex flex-col h-36 overflow-y-auto">
//                 {[...Array(31)].map((_, i) => (
//                   <label key={i + 1} className="inline-flex items-center mb-1">
//                     <Checkbox
//                       checked={days.includes(i + 1)}
//                       onCheckedChange={() => toggle(i + 1, setDays, days)}
//                     />
//                     <span className="ml-1">{i + 1}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <div className="text-xs font-medium mb-1">Days of week</div>
//               <div className="flex flex-col h-36 overflow-y-auto">
//                 {daysOfWeek.map((d) => (
//                   <label key={d} className="inline-flex items-center mb-1">
//                     <Checkbox
//                       checked={weekdays.includes(d)}
//                       onCheckedChange={() => toggle(d, setWeekdays, weekdays)}
//                     />
//                     <span className="ml-1">{d}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <div className="text-xs font-medium mb-1">Months</div>
//               <div className="flex flex-col h-36 overflow-y-auto">
//                 {months.map((m) => (
//                   <label key={m} className="inline-flex items-center mb-1">
//                     <Checkbox
//                       checked={selectedMonths.includes(m)}
//                       onCheckedChange={() =>
//                         toggle(m, setSelectedMonths, selectedMonths)
//                       }
//                     />
//                     <span className="ml-1">{m}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <div className="text-xs font-medium mb-1">Hours</div>
//               <div className="flex flex-col h-36 overflow-y-auto">
//                 {[...Array(24)].map((_, i) => (
//                   <label key={i} className="inline-flex items-center mb-1">
//                     <Checkbox
//                       checked={hours.includes(i)}
//                       onCheckedChange={() => toggle(i, setHours, hours)}
//                     />
//                     <span className="ml-1">{i}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <div className="text-xs font-medium mb-1">Minutes</div>
//               <div className="flex flex-col h-36 overflow-y-auto">
//                 {[...Array(60)].map((_, i) => (
//                   <label key={i} className="inline-flex items-center mb-1">
//                     <Checkbox
//                       checked={minutes.includes(i)}
//                       onCheckedChange={() => toggle(i, setMinutes, minutes)}
//                     />
//                     <span className="ml-1">{i}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }
// );

// export default SchedulePicker;

import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

type SchedulePickerProps = {
  mode: string;
  setMode: (value: string) => void;
  everyMinutes: number;
  setEveryMinutes: (value: number) => void;
  dailyTime: string;
  setDailyTime: (value: string) => void;
};

export default function SchedulePicker({
  mode,
  setMode,
  everyMinutes,
  setEveryMinutes,
  dailyTime,
  setDailyTime,
}: SchedulePickerProps) {
  return (
    <div className="p-4 border rounded bg-white shadow max-w-lg">
      <h2 className="text-lg font-semibold mb-4">Execution Schedule</h2>
      <RadioGroup value={mode} onValueChange={setMode} className="space-y-3">
        <div className="flex gap-2 items-center">
          <RadioGroupItem value="minutes" id="minutes" />
          <Label htmlFor="minutes" className="flex items-center gap-2">
            Every
            <input
              type="number"
              min={1}
              max={60}
              className="w-20 px-2 py-1 border rounded disabled:bg-gray-100"
              disabled={mode !== "minutes"}
              value={everyMinutes}
              onChange={(e) => setEveryMinutes(Number(e.target.value))}
            />
            minute(s)
          </Label>
        </div>

        <div className="flex gap-2 items-center">
          <RadioGroupItem value="daily" id="daily" />
          <Label htmlFor="daily" className="flex items-center gap-2">
            Every day at
            <input
              type="time"
              className="w-32 px-2 py-1 border rounded disabled:bg-gray-100"
              disabled={mode !== "daily"}
              value={dailyTime}
              onChange={(e) => setDailyTime(e.target.value)}
            />
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
