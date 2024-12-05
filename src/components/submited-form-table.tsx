// "use client";

// import * as React from "react";
// import {
//     ColumnDef,
//     SortingState,
//     ColumnFiltersState,
//     VisibilityState,
//     getCoreRowModel,
//     getFilteredRowModel,
//     getPaginationRowModel,
//     getSortedRowModel,
//     useReactTable,
// } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
// import {
//     DropdownMenu,
//     DropdownMenuCheckboxItem,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableRow,
//     TableHeader,
// } from "@/components/ui/table";

// // Define the structure of your submission data
// export type Submission = {
//     formId: string;
//     preview: Array<{ id: string; name: string }>;
//     fillInBlanks: string;
//     paragraphs: Record<string, string>;
// };

// export const columns: ColumnDef<Submission>[] = [
//     {
//         accessorKey: "formId",
//         header: "Form ID",
//         cell: ({ row }) => row.getValue("formId"),
//     },
//     {
//         accessorKey: "preview",
//         header: "Preview",
//         cell: ({ row }) => (
//             <div>
//                 {row.getValue("preview").map((category) => (
//                     <div key={category.id}>
//                         <strong>{category.name}</strong>
//                     </div>
//                 ))}
//             </div>
//         ),
//     },
//     {
//         accessorKey: "fillInBlanks",
//         header: "Fill-in-the-Blanks",
//         cell: ({ row }) => row.getValue("fillInBlanks"),
//     },
//     {
//         accessorKey: "paragraphs",
//         header: "Paragraph Answers",
//         cell: ({ row }) => (
//             <div>
//                 {Object.values(row.getValue("paragraphs")).map((content, idx) => (
//                     <div key={idx}>{content}</div>
//                 ))}
//             </div>
//         ),
//     },
//     {
//         id: "actions",
//         enableHiding: false,
//         cell: ({ row }) => {
//             const submission = row.original;
//             return (
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" className="h-8 w-8 p-0">
//                             <span className="sr-only">Open menu</span>
//                             {/* Icon here */}
//                         </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                         <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                         <DropdownMenuItem
//                             onClick={() => navigator.clipboard.writeText(submission.formId)}
//                         >
//                             Copy Form ID
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem>View submission details</DropdownMenuItem>
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//             );
//         },
//     },
// ];

// export function SubmittedData({ data }: { data: Submission[] }) {
//     console.log("🚀 ~ SubmittedData ~ data:", data)
//     const [sorting, setSorting] = React.useState<SortingState>([]);
//     const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
//     const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
//     const [rowSelection, setRowSelection] = React.useState({});

//     const table = useReactTable({
//         data,
//         columns,
//         onSortingChange: setSorting,
//         onColumnFiltersChange: setColumnFilters,
//         getCoreRowModel: getCoreRowModel(),
//         getPaginationRowModel: getPaginationRowModel(),
//         getSortedRowModel: getSortedRowModel(),
//         getFilteredRowModel: getFilteredRowModel(),
//         onColumnVisibilityChange: setColumnVisibility,
//         onRowSelectionChange: setRowSelection,
//         state: {
//             sorting,
//             columnFilters,
//             columnVisibility,
//             rowSelection,
//         },
//     });

//     return (
//         <div className="w-full">
//             {/* <div className="flex items-center py-4">
//                 <Input
//                     placeholder="Filter..."
//                     value={(table.getColumn("preview")?.getFilterValue() as string) ?? ""}
//                     onChange={(event) =>
//                         table.getColumn("preview")?.setFilterValue(event.target.value)
//                     }
//                     className="max-w-sm"
//                 />
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button variant="outline" className="ml-auto">
//                             Columns
//                         </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                         {table
//                             .getAllColumns()
//                             .filter((column) => column.getCanHide())
//                             .map((column) => (
//                                 <DropdownMenuCheckboxItem
//                                     key={column.id}
//                                     checked={column.getIsVisible()}
//                                     onCheckedChange={(value) =>
//                                         column.toggleVisibility(!!value)
//                                     }
//                                 >
//                                     {column.id}
//                                 </DropdownMenuCheckboxItem>
//                             ))}
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//             </div>
//             <div className="rounded-md border">
//                 <Table>
//                     <TableHeader>
//                         {table.getHeaderGroups().map((headerGroup) => (
//                             <TableRow key={headerGroup.id}>
//                                 {headerGroup.headers.map((header) => (
//                                     <TableHead key={header.id}>
//                                         {header.isPlaceholder
//                                             ? null
//                                             : header.render("Header")}
//                                     </TableHead>
//                                 ))}
//                             </TableRow>
//                         ))}
//                     </TableHeader>
//                     <TableBody>
//                         {table.getRowModel().rows.length ? (
//                             table.getRowModel().rows.map((row) => (
//                                 <TableRow key={row.id}>
//                                     {row.getVisibleCells().map((cell) => (
//                                         <TableCell key={cell.id}>
//                                             {cell.render("Cell")}
//                                         </TableCell>
//                                     ))}
//                                 </TableRow>
//                             ))
//                         ) : (
//                             <TableRow>
//                                 <TableCell colSpan={columns.length} className="h-24 text-center">
//                                     No results.
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>
//                 </Table>
//             </div> */}
//             <div className="flex items-center justify-end space-x-2 py-4">
//                 <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => table.previousPage()}
//                     disabled={!table.getCanPreviousPage()}
//                 >
//                     Previous
//                 </Button>
//                 <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => table.nextPage()}
//                     disabled={!table.getCanNextPage()}
//                 >
//                     Next
//                 </Button>
//             </div>
//         </div>
//     );
// }
