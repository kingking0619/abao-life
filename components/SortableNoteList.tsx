"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";



function getUserIcon(name:string){

  return name === "國王老師"
    ? "👑"
    : "🧸";

}



function formatDate(date:string){

  const d = new Date(date);

  return (
    `${d.getMonth()+1}/${d.getDate()} ` +
    `${String(d.getHours()).padStart(2,"0")}:` +
    `${String(d.getMinutes()).padStart(2,"0")}`
  );

}



function SortableNote({
  note,
  onPin,
}: {
  note:any;
  onPin:(note:any)=>void;
}) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: note.id,
  });


  const style = {
    transform:
      CSS.Transform.toString(transform),
    transition,
  };


  return (

    <article
      ref={setNodeRef}
      style={style}
      className={`
        rounded-3xl
        bg-white
        p-4
        shadow
        ${
          isDragging
            ? "opacity-40"
            : ""
        }
      `}
    >


      <div className="flex items-start gap-3">


        {/* 拖曳 */}

        <button
          type="button"
          {...attributes}
          {...listeners}
          className="
            mt-1
            shrink-0
            cursor-grab
            touch-none
            select-none
            text-2xl
            text-gray-400
            active:cursor-grabbing
          "
        >
          ☷
        </button>



        <div className="min-w-0 flex-1">


          <div className="flex items-start justify-between gap-2">


            <Link
              href={`/notes/${note.id}`}
              className="min-w-0 flex-1"
            >

              <h3 className="break-words text-lg font-bold">

                {note.title}

              </h3>

            </Link>



            {/* 釘選 */}

            <button
              type="button"
              onClick={() =>
                onPin(note)
              }
              className={`
                shrink-0
                rounded-xl
                px-3
                py-2
                text-sm
                ${
                  note.is_pinned
                    ? "bg-[#fff5dc]"
                    : "bg-gray-100"
                }
              `}
              title={
                note.is_pinned
                  ? "取消置頂"
                  : "置頂記事"
              }
            >

              {note.is_pinned
                ? "📌"
                : "📍"}

            </button>


          </div>



          {note.content && (

            <Link
              href={`/notes/${note.id}`}
              className="block"
            >

              <p
                className="
                mt-3
                max-h-44
                overflow-hidden
                break-words
                whitespace-pre-wrap
                text-sm
                leading-6
                text-gray-600
                "
                >
                {note.content}
                </p>

            </Link>

          )}



          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">


            <span className="text-xs text-gray-400">

              {getUserIcon(note.created_by)}

              {" "}

              {note.created_by}

            </span>


            <span className="text-xs text-gray-400">

              {formatDate(note.created_at)}

            </span>


          </div>


        </div>


      </div>


    </article>

  );

}



export default function SortableNoteList({
  initialNotes,
}: {
  initialNotes:any[];
}) {

  const [
    notes,
    setNotes,
  ] = useState(initialNotes);



  useEffect(() => {

    setNotes(initialNotes);

  }, [initialNotes]);



  const sensors = useSensors(

    useSensor(
      PointerSensor,
      {
        activationConstraint: {
          distance: 5,
        },
      }
    )

  );



  async function saveOrder(
    newNotes:any[]
  ) {

    try {

      const response =
        await fetch(
          "/api/notes/order",
          {
            method:"PATCH",

            headers:{
              "Content-Type":
                "application/json",
            },

            body:JSON.stringify({

              items:
                newNotes.map(
                  (note,index)=>({
                    id:note.id,
                    sort_order:index,
                  })
                ),

            }),

          }
        );


      if (!response.ok) {

        console.error(
          "記事排序儲存失敗"
        );

      }


    } catch(error) {

      console.error(
        "記事排序儲存失敗:",
        error
      );

    }

  }



  function handleDragEnd(event:any) {

    const {
      active,
      over,
    } = event;


    if (!over) {
      return;
    }


    if (
      active.id === over.id
    ) {
      return;
    }


    const oldIndex =
      notes.findIndex(
        note =>
          note.id === active.id
      );


    const newIndex =
      notes.findIndex(
        note =>
          note.id === over.id
      );


    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {
      return;
    }


    const newNotes =
      arrayMove(
        notes,
        oldIndex,
        newIndex
      );


    setNotes(newNotes);

    saveOrder(newNotes);

  }



  async function togglePin(
    note:any
  ) {

    const newValue =
      !note.is_pinned;


    // 先更新畫面
    const updated =
      notes.map(item =>
        item.id === note.id
          ? {
              ...item,
              is_pinned:newValue,
            }
          : item
      );


    setNotes(updated);


    try {

      const response =
        await fetch(
          `/api/notes/${note.id}/pin`,
          {
            method:"PATCH",

            headers:{
              "Content-Type":
                "application/json",
            },

            body:JSON.stringify({
              is_pinned:newValue,
            }),
          }
        );


      if (!response.ok) {

        // 失敗就恢復
        setNotes(notes);

        alert("置頂失敗");

      }


    } catch(error) {

      console.error(error);

      setNotes(notes);

      alert("置頂失敗");

    }

  }



  const pinnedNotes =
    notes.filter(
      note => note.is_pinned
    );


  const normalNotes =
    notes.filter(
      note => !note.is_pinned
    );



  return (

    <div className="space-y-6">


      {/* 置頂記事 */}

      {pinnedNotes.length > 0 && (

        <section>


          <h2 className="mb-3 text-lg font-bold">
            📌 置頂記事
          </h2>


          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >

            <SortableContext
              items={
                pinnedNotes.map(
                  note => note.id
                )
              }
              strategy={
                verticalListSortingStrategy
              }
            >

              <div className="space-y-3">

                {pinnedNotes.map(note=>(

                  <SortableNote
                    key={note.id}
                    note={note}
                    onPin={togglePin}
                  />

                ))}

              </div>

            </SortableContext>

          </DndContext>


        </section>

      )}



      {/* 一般記事 */}

      <section>


        {pinnedNotes.length > 0 && (

          <h2 className="mb-3 text-lg font-bold">
            📝 其他記事
          </h2>

        )}


        {normalNotes.length === 0 ? (

          <div className="rounded-3xl bg-white p-5 text-center text-gray-400 shadow">

            目前沒有其他記事

          </div>

        ) : (

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >

            <SortableContext
              items={
                normalNotes.map(
                  note => note.id
                )
              }
              strategy={
                verticalListSortingStrategy
              }
            >

              <div className="space-y-3">

                {normalNotes.map(note=>(

                  <SortableNote
                    key={note.id}
                    note={note}
                    onPin={togglePin}
                  />

                ))}

              </div>

            </SortableContext>

          </DndContext>

        )}


      </section>


    </div>

  );

}