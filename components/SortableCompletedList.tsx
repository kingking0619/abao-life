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

import Link from "next/link";
import { useEffect, useState } from "react";


type CompletedItem =
  | {
      type: "task";
      id: string;
      task: any;
      completedAt: number;
    }
  | {
      type: "chain";
      id: string;
      chain: any;
      completedAt: number;
    };


function getIcon(name:string){

  return name === "國王老師"
    ? "👑"
    : "🧸";

}


function SortableCompletedItem({
  item,
}:{
  item:CompletedItem;
}){

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id:item.id,
  });


  const style = {
  transform: transform
    ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
    : undefined,

  transition,
};


  if(item.type === "task"){

    const task =
      item.task;


    return(

      <section
        ref={setNodeRef}
        style={style}
        className={`
          rounded-3xl
          bg-gray-100
          p-5
          shadow
          ${
            isDragging
              ? "opacity-40"
              : ""
          }
        `}
      >

        <div className="flex items-start gap-3">


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



          <Link
            href={`/tasks/${task.id}`}
            className="min-w-0 flex-1"
          >

            <div className="flex items-start justify-between gap-3">

              <div className="min-w-0 flex-1">

                <p className="text-sm font-bold text-green-600">
                  ✅ 一般任務
                </p>

                <h3 className="mt-1 break-words text-lg font-bold">
                  {task.title}
                </h3>

                <p className="mt-2 text-sm text-gray-500">

                  {getIcon(
                    task.assign_to
                  )}

                  {" "}

                  {task.assign_to}

                </p>

              </div>


              <span className="shrink-0 font-bold">
                🪙 {task.reward}
              </span>

            </div>

          </Link>


        </div>

      </section>

    );

  }



  const chain =
    item.chain;


  return(

    <section
      ref={setNodeRef}
      style={style}
      className={`
        rounded-3xl
        bg-gray-100
        p-5
        shadow
        ${
          isDragging
            ? "opacity-40"
            : ""
        }
      `}
    >

      <div className="flex items-start gap-3">


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


          <div className="flex items-start justify-between gap-3">


            <div className="min-w-0 flex-1">

              <p className="text-sm font-bold text-green-600">
                🔗 連鎖任務
              </p>

              <h3 className="mt-1 break-words text-xl font-bold">
                {chain.title}
              </h3>

              <p className="mt-2 text-sm text-gray-500">

                {getIcon(
                  chain.assign_to
                )}

                {" "}

                {chain.assign_to}

              </p>

            </div>


            <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-700">

              ✅ {chain.completedCount}/{chain.totalCount}

            </span>


          </div>



          <div className="mt-4 rounded-2xl bg-green-50 p-3">

            <p className="font-bold text-green-700">
              🎉 連鎖任務全部完成
            </p>

          </div>



          <div className="mt-4 space-y-2">

            {chain.tasks.map((task:any)=>(

              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-sm"
              >

                <span className="min-w-0 truncate">
                  ✅ {task.chain_step}. {task.title}
                </span>

                <span className="shrink-0 text-gray-400">
                  🪙{task.reward}
                </span>

              </Link>

            ))}

          </div>


        </div>


      </div>

    </section>

  );

}


export default function SortableCompletedList({
  initialItems,
}:{
  initialItems:CompletedItem[];
}){

  const [
    items,
    setItems,
  ] = useState(
    initialItems
  );


  useEffect(()=>{

    setItems(
      initialItems
    );

  },[
    initialItems
  ]);


  const sensors =
    useSensors(

      useSensor(
        PointerSensor,
        {
          activationConstraint:{
            distance:5,
          },
        }
      )

    );


  async function saveOrder(
    newItems:CompletedItem[]
  ){

    try{

      const response =
        await fetch(
          "/api/completed-order",
          {
            method:"PATCH",

            headers:{
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({

                items:
                  newItems.map(
                    (
                      item,
                      index
                    ) => ({

                      id:item.id,

                      type:
                        item.type,

                      sort_order:
                        index,

                    })
                  ),

              }),

          }
        );


      if(!response.ok){

        const data =
          await response.json();

        console.error(
          "已完成排序儲存失敗:",
          data
        );

      }

    }catch(error){

      console.error(
        "已完成排序儲存失敗:",
        error
      );

    }

  }


  function handleDragEnd(
    event:any
  ){

    const {
      active,
      over,
    } = event;


    if(!over){
      return;
    }


    if(
      active.id ===
      over.id
    ){
      return;
    }


    const oldIndex =
      items.findIndex(
        item =>
          item.id ===
          active.id
      );


    const newIndex =
      items.findIndex(
        item =>
          item.id ===
          over.id
      );


    if(
      oldIndex === -1 ||
      newIndex === -1
    ){
      return;
    }


    const newItems =
      arrayMove(
        items,
        oldIndex,
        newIndex
      );


    setItems(
      newItems
    );


    saveOrder(
      newItems
    );

  }


  return(

    <DndContext
      sensors={sensors}
      collisionDetection={
        closestCenter
      }
      onDragEnd={
        handleDragEnd
      }
    >

      <SortableContext
        items={
          items.map(
            item =>
              item.id
          )
        }
        strategy={
          verticalListSortingStrategy
        }
      >

        <div className="space-y-4">

          {items.map(
            item => (

              <SortableCompletedItem
                key={item.id}
                item={item}
              />

            )
          )}

        </div>

      </SortableContext>

    </DndContext>

  );

}