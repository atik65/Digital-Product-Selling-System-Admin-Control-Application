import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { memo, useMemo } from "react";
import SelectItem from "./SelectItem";
import SelelctResponsiveWrapper from "./SelelctResponsiveWrapper";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const CheckIsFormWrapper = ({
  form,
  name,
  children,
  title,
  placeholder,
  required,
}) =>
  form ? (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          {title && (
            <FormLabel>
              {title}
              {required && (
                <span className="font-bold text-base ml-0.5 text-destructive">
                  *
                </span>
              )}
            </FormLabel>
          )}
          {children(field)}
          <FormMessage />
        </FormItem>
      )}
    />
  ) : (
    children(null)
  );

const SelectList = ({
  form,
  title,
  name,
  options = [],
  isLoading,
  multiSelect = false,
  value,
  setValue,
  showMax,
  inputClassName,
  commandClassName,
  placeholder,
  required,
  onAddNew,
}) => {
  const isForm = !!form;
  const formValue = isForm ? form.getValues(name) : null;
  const multiSelectValues = useMemo(
    () => (multiSelect ? new Set(formValue || value) : null),
    [multiSelect, formValue, value]
  );
  const singleSelectValue = useMemo(
    () => (!multiSelect ? formValue || value : null),
    [multiSelect, formValue, value]
  );
  const setSelectValue = isForm ? form?.setValue : setValue;

  return (
    <CheckIsFormWrapper
      name={name}
      form={form}
      title={title}
      placeholder={placeholder}
      required={required}
    >
      {(field) => (
        <SelelctResponsiveWrapper
          className={inputClassName}
          commandClassName={commandClassName}
          field={field}
          trigerProps={{
            showMax,
            isForm,
            title,
            placeholder,
            name,
            options,
            isLoading,
            multiSelect,
            multiSelectValues,
            singleSelectValue,
            setSelectValue,
          }}
        >
          {(handleClose) => (
            <Command
              filter={(value, search) => {
                if (value.toLowerCase().includes(search.toLowerCase()))
                  return 1;
                return 0;
              }}
              className={cn("rounded-none md:rounded-sm ", commandClassName)}
            >
              <CommandInput placeholder="Search..." />
              {onAddNew && (
                <div className="border-b p-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onAddNew}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                  </Button>
                </div>
              )}
              <CommandList className="overflow-y-auto min-h-[unset] max-h-[35vh] [&>div]:h-full">
                {!options.length ? (
                  <div
                    className="py-6 text-center text-sm "
                    cmdk-empty=""
                    role="presentation"
                  >
                    No results found.
                  </div>
                ) : (
                  <>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => (
                        <SelectItem
                          name={name}
                          key={option?.id}
                          singleSelectValue={singleSelectValue}
                          multiSelectValues={multiSelectValues}
                          setSelectValue={setSelectValue}
                          isForm={isForm}
                          handleClose={handleClose}
                          multiSelect={multiSelect}
                          option={option}
                        />
                      ))}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          )}
        </SelelctResponsiveWrapper>
      )}
    </CheckIsFormWrapper>
  );
};

export default memo(SelectList);

// import {
//   Command,
//   CommandGroup,
//   CommandInput,
//   CommandList,
// } from "@/components/ui/command";
// import {
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { memo, useMemo, useState } from "react";
// import { Virtuoso } from "react-virtuoso";
// import SelectItem from "./SelectItem";
// import SelelctResponsiveWrapper from "./SelelctResponsiveWrapper";

// const CheckIsFormWrapper = ({ form, name, children, title }) =>
//   form ? (
//     <FormField
//       control={form.control}
//       name={name}
//       render={({ field }) => (
//         <FormItem className="flex flex-col">
//           <FormLabel>{title}</FormLabel>
//           {children(field)}
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   ) : (
//     children(null)
//   );

// const SelectList = ({
//   form,
//   title,
//   name,
//   options = [],
//   isLoading,
//   multiSelect = false,
//   value,
//   setValue,
//   showMax,
// }) => {
//   const isForm = !!form;
//   const formValue = isForm ? form.getValues()?.[name] : null;
//   const multiSelectValues = useMemo(
//     () => (multiSelect ? new Set(formValue || value) : null),
//     [multiSelect, formValue, value]
//   );
//   const singleSelectValue = useMemo(
//     () => (!multiSelect ? formValue || value : null),
//     [multiSelect, formValue, value]
//   );
//   const setSelectValue = isForm ? form?.setValue : setValue;

//   const [search, setSearch] = useState("");

//   // Filter the data based on search
//   const filteredItems = useMemo(
//     () =>
//       options.filter((item) =>
//         item?.label?.toLowerCase()?.includes(search?.toLowerCase())
//       ),
//     [options, search]
//   );
//   return (
//     <CheckIsFormWrapper name={name} form={form} title={title}>
//       {(field) => (
//         <SelelctResponsiveWrapper
//           field={field}
//           trigerProps={{
//             showMax,
//             isForm,
//             title,
//             name,
//             options,
//             isLoading,
//             multiSelect,
//             multiSelectValues,
//             singleSelectValue,
//             setSelectValue,
//           }}
//         >
//           {(handleClose) => (
//             <Command
//               shouldFilter={false}
//               className="rounded-none md:rounded-sm"
//             >
//               <CommandInput
//                 placeholder="Search..."
//                 value={search}
//                 onValueChange={setSearch}
//               />
//               <CommandList className="max-h-[unset] h-[35vh] [&>div]:h-full">
//                 {!filteredItems.length ? (
//                   <div
//                     className="py-6 text-center text-sm"
//                     cmdk-empty=""
//                     role="presentation"
//                   >
//                     No results found.
//                   </div>
//                 ) : (
//                   <>
//                     {/* <CommandGroup className="[&>div]:h-full p-0 h-full"> */}
//                       <Virtuoso
//                         style={{ height: "100%" }}
//                         data={filteredItems}
//                         itemContent={(_, option) => (
//                           <SelectItem
//                             name={name}
//                             key={option?.id}
//                             singleSelectValue={singleSelectValue}
//                             multiSelectValues={multiSelectValues}
//                             setSelectValue={setSelectValue}
//                             isForm={isForm}
//                             handleClose={handleClose}
//                             multiSelect={multiSelect}
//                             option={option}
//                           />
//                         )}
//                       />
//                     {/* </CommandGroup> */}
//                   </>
//                 )}
//               </CommandList>
//             </Command>
//           )}
//         </SelelctResponsiveWrapper>
//       )}
//     </CheckIsFormWrapper>
//   );
// };

// export default memo(SelectList);
// // Function to generate an array of users
// function generateUsers(count) {
//   const users = [];
//   const groupNames = ["Group A", "Group B", "Group C", "Group D"]; // Example group names
//   const namePrefixes = ["Alice", "Bob", "Charlie", "David", "Emma", "Frank"]; // Example name prefixes
//   const minAge = 20; // Minimum age for users
//   const maxAge = 50; // Maximum age for users

//   for (let i = 0; i < count; i++) {
//     const randomNameIndex = Math.floor(Math.random() * namePrefixes.length);
//     const randomGroupNameIndex = Math.floor(Math.random() * groupNames.length);
//     const randomAge =
//       Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;

//     const newUser = {
//       name: `${namePrefixes[randomNameIndex]}`,
//       age: randomAge,
//       group_name: groupNames[randomGroupNameIndex],
//     };

//     users.push(newUser);
//   }

//   return users;
// }

// // Example usage:
// const thousandUsers = generateUsers(100);

// // Efficient reorganization and sorting function
// const reorganizeAndSortUsers = (usersArray) => {
//   // Sort users alphabetically by group_name
//   usersArray.sort((a, b) => a.group_name?.localeCompare(b?.group_name));

//   // Create the final structure
//   const organizedUsers = [];
//   let currentGroupName = null;

//   usersArray.forEach((user) => {
//     if (user.group_name !== currentGroupName) {
//       organizedUsers.push({ group_name: user.group_name });
//       currentGroupName = user.group_name;
//     }
//     organizedUsers.push({ name: user.name, age: user.age });
//   });

//   return organizedUsers;
// };

// // Reorganize and sort the users array efficiently
// const organizedUsers = reorganizeAndSortUsers(thousandUsers);

// // Output the organized and sorted users array
// console.log(organizedUsers);
