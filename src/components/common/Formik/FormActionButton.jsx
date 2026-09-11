// import React from "react";
// import { motion } from "framer-motion";
// import { cn } from "@/lib/utils";
// import { Loader, ArrowRight } from "lucide-react";
// import { ArrowLeft } from "lucide-react";

// const FormActionButton = ({
//   isDirty = true,
//   isValid = true,
//   isSubmitting,
//   className,
//   type = "submit",
//   label = "Submit",
//   submittingLabel = "",
//   showArrow = true,
//   ...props
// }) => {
//   return (
//     <motion.button
//       whileHover={{
//         scale: !isSubmitting && isDirty ? 1.02 : 1,
//         y: !isSubmitting && isDirty ? -2 : 0,
//       }}
//       whileTap={{ scale: !isSubmitting && isDirty ? 0.98 : 1 }}
//       type={type}
//       disabled={!isDirty || isSubmitting}
//       className={cn(
//         "relative overflow-hidden w-full py-3 px-6 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group",
//         !isDirty || isSubmitting
//           ? "opacity-50 cursor-not-allowed"
//           : "hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl cursor-pointer",
//         className
//       )}
//       {...props}
//     >
//       {/* Background gradient overlay on hover */}
//       {isDirty && !isSubmitting && (
//         <div className="absolute inset-0 bg-linear-to-r from-blue-500/0 via-purple-500/20 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//       )}

//       {/* Content */}
//       <span className="relative z-10 flex items-center justify-center gap-2">
//         {isSubmitting ? (
//           <>
//             <Loader className="w-5 h-5 animate-spin" />
//             {submittingLabel && <span>{submittingLabel}</span>}
//           </>
//         ) : (
//           <>
//             <span>{label}</span>
//             {showArrow && (
//               <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
//             )}
//           </>
//         )}
//       </span>

//       {/* Shine effect on hover */}
//       {isDirty && !isSubmitting && (
//         <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
//           <motion.div
//             initial={{ x: "-100%" }}
//             whileHover={{ x: "100%" }}
//             transition={{ duration: 0.6, ease: "easeInOut" }}
//             className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12"
//           />
//         </div>
//       )}
//     </motion.button>
//   );
// };

// export default FormActionButton;

// // Back Button
// export const FormBackButton = ({ className, ...props }) => {
//   return (
//     <button
//       {...props}
//       className={cn(
//         "relative overflow-hidden w-full py-3 px-6 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl cursor-pointer",
//         className
//       )}
//     >
//       <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />{" "}
//       Back
//     </button>
//   );
// };

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader, ArrowRight, ArrowLeft } from "lucide-react";

const FormActionButton = ({
  isDirty = true,
  isValid = true,
  isSubmitting,
  className,
  type = "submit",
  label = "Submit",
  submittingLabel = "",
  showArrow = true,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{
        scale: !isSubmitting && isDirty ? 1.02 : 1,
        y: !isSubmitting && isDirty ? -2 : 0,
      }}
      whileTap={{ scale: !isSubmitting && isDirty ? 0.98 : 1 }}
      type={type}
      disabled={!isDirty || isSubmitting}
      className={cn(
        "relative overflow-hidden w-full py-3 px-6 bg-linear-to-r from-[#006A4E] to-[#009E60] text-white rounded-[10px] text-sm font-bold shadow-lg transition-all duration-300 flex items-center justify-center hover:from-[#005A3C] hover:to-[#007A4D] transition-alljustify-center gap-2 group",
        !isDirty || isSubmitting
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-[#005a42] hover:shadow-xl cursor-pointer",
        className
      )}
      // className={cn(
      //   "relative overflow-hidden w-full py-3 px-6 bg-[#006A4E] text-white rounded-xl text-sm font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group",
      //   !isDirty || isSubmitting
      //     ? "opacity-50 cursor-not-allowed"
      //     : "hover:bg-[#005a42] hover:shadow-xl cursor-pointer",
      //   className
      // )}
      {...props}
    >
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isSubmitting ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            {submittingLabel && <span>{submittingLabel}</span>}
          </>
        ) : (
          <>
            <span>{label}</span>
            {showArrow && (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            )}
          </>
        )}
      </span>
    </motion.button>
  );
};

// Back Button
export const FormBackButton = ({ className, ...props }) => {
  return (
    <button
      {...props}
      className={cn(
        "relative overflow-hidden w-full py-3 px-6  bg-linear-to-l from-[#F3F4F6] to-[#F3F4F6] text-[#364153] rounded-[10px] text-sm font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group hover:bg-[#005a42] hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border  ",
        className
      )}
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />{" "}
      Back
    </button>
  );
};

export default FormActionButton;
