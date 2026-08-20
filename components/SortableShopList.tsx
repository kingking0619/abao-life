"use client";

import {
  DndContext,
  DragOverlay,
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
  memo,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import ExchangeButton from "@/components/ExchangeButton";



function ShopContent({
  item,
}: {
  item: any;
}) {

  return (

    <>

      <div className="flex items-start justify-between gap-3">


        <div className="min-w-0 flex-1">

          <h2 className="text-xl font-bold">

            {item.name}

          </h2>


          {item.description && (

            <p className="mt-2 whitespace-pre-wrap text-gray-500">

              {item.description}

            </p>

          )}


          <p className="mt-3 text-2xl font-bold">

            🪙 {item.price}

          </p>

        </div>



        <Link
          href={`/shop/${item.id}/edit`}
          className="
            shrink-0
            rounded-xl
            bg-gray-100
            px-3
            py-2
            text-sm
            font-bold
          "
        >
          ✏️
        </Link>


      </div>

    </>

  );

}




const SortableItem = memo(
  function SortableItem({
    item,
  }: {
    item: any;
  }) {

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: item.id,
    });



    const style = {

      transform:
        CSS.Transform.toString(
          transform
        ),

      transition,

    };



    return (

      <section
        ref={setNodeRef}
        style={style}
        className={`
          rounded-3xl
          bg-white
          p-5
          shadow
          transition

          ${
            isDragging
              ? "scale-95 opacity-40"
              : ""
          }
        `}
      >


        <div className="flex items-start gap-3">


          {/* 拖曳把手 */}

          <button
            type="button"
            {...attributes}
            {...listeners}
            className="
              mt-1
              shrink-0
              cursor-grab
              select-none
              touch-none
              text-2xl
              active:cursor-grabbing
            "
          >
            ☷
          </button>



          <div className="min-w-0 flex-1">


            <ShopContent
              item={item}
            />


            <ExchangeButton
              id={item.id}
            />


          </div>


        </div>


      </section>

    );

  }
);




function DragCard({
  item,
}: {
  item: any;
}) {

  return (

    <section
      className="
        rounded-3xl
        bg-white
        p-5
        shadow-2xl
        scale-105
      "
    >


      <div className="flex items-start gap-3">


        <div className="mt-1 text-2xl">
          ☷
        </div>


        <div className="min-w-0 flex-1">

          <ShopContent
            item={item}
          />

        </div>


      </div>


    </section>

  );

}




export default function SortableShopList({
  items: initialItems,
}: {
  items: any[];
}) {

  const [
    items,
    setItems,
  ] = useState(initialItems);


  const [
    activeItem,
    setActiveItem,
  ] = useState<any>(null);


  const [
    pointerY,
    setPointerY,
  ] = useState(0);



  useEffect(() => {

    setItems(initialItems);

  }, [initialItems]);



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



  // 追蹤拖曳位置

  useEffect(() => {

    function move(
      event: PointerEvent
    ) {

      setPointerY(
        event.clientY
      );

    }


    window.addEventListener(
      "pointermove",
      move
    );


    return () => {

      window.removeEventListener(
        "pointermove",
        move
      );

    };

  }, []);



  // 靠近上下邊緣時自動滾動

  useEffect(() => {

    if (!activeItem) {
      return;
    }


    const timer =
      window.setInterval(
        () => {

          const height =
            window.innerHeight;

          const edge = 120;


          if (
            pointerY < edge
          ) {

            window.scrollBy(
              0,
              -12
            );

          }


          if (
            pointerY >
            height - edge
          ) {

            window.scrollBy(
              0,
              12
            );

          }

        },
        20
      );


    return () => {

      window.clearInterval(
        timer
      );

    };

  }, [
    activeItem,
    pointerY,
  ]);



  async function saveOrder(
    newItems: any[]
  ) {

    try {

      const response =
        await fetch(
          "/api/shop-items/order",
          {
            method: "PATCH",

            headers: {
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
                      id: item.id,

                      sort_order:
                        index,
                    })
                  ),
              }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        console.error(
          "商城排序儲存失敗:",
          data
        );

      }

    } catch (error) {

      console.error(
        "商城排序儲存失敗:",
        error
      );

    }

  }



  function handleDragStart(
    event: any
  ) {

    const item =
      items.find(
        (item) =>
          item.id ===
          event.active.id
      );


    setActiveItem(item);

  }



  function handleDragEnd(
    event: any
  ) {

    const {
      active,
      over,
    } = event;


    setActiveItem(null);


    if (!over) {
      return;
    }


    if (
      active.id === over.id
    ) {

      return;

    }



    const oldIndex =
      items.findIndex(
        (item) =>
          item.id === active.id
      );


    const newIndex =
      items.findIndex(
        (item) =>
          item.id === over.id
      );


    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {

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



  return (

    <DndContext
      id="shop-dnd"
      sensors={sensors}
      collisionDetection={
        closestCenter
      }
      onDragStart={
        handleDragStart
      }
      onDragEnd={
        handleDragEnd
      }
      onDragCancel={() =>
        setActiveItem(null)
      }
    >


      <SortableContext
        items={
          items.map(
            (item) =>
              item.id
          )
        }
        strategy={
          verticalListSortingStrategy
        }
      >


        <div className="space-y-4">

          {items.map(
            (item) => (

              <SortableItem
                key={item.id}
                item={item}
              />

            )
          )}

        </div>


      </SortableContext>



      <DragOverlay>

        {activeItem && (

          <DragCard
            item={
              activeItem
            }
          />

        )}

      </DragOverlay>


    </DndContext>

  );

}