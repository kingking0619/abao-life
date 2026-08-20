"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import Link from "next/link";
import { useEffect, useState, memo } from "react";

import CompleteButton from "@/components/CompleteButton";





function formatDueDate(date:string|null){

  if(!date) return null;


  const d = new Date(date);


  return (

    `${d.getMonth()+1}/${d.getDate()} ` +

    `${String(d.getHours()).padStart(2,"0")}:` +

    `${String(d.getMinutes()).padStart(2,"0")}`

  );

}







function TaskContent({

  task,

}:{

  task:any;

}){


  const comments = task.task_comments ?? [];


  const latestComment =

    comments.length > 0

    ?

    comments[comments.length - 1]

    :

    null;





  return (

    <>



      <div className="flex justify-between">


        <h3 className="text-lg font-bold">

          {task.title}

        </h3>



        <span className="font-bold">

          🪙 {task.reward}

        </span>


      </div>







      <p className="mt-2 text-gray-500">


        {

          task.assign_to === "國王老師"

          ?

          "👑"

          :

          "🧸"

        }


        {" "}


        {task.assign_to}


      </p>







      {

        task.due_at &&

        (

          <p className="mt-2 text-sm">

            ⏰ {formatDueDate(task.due_at)}

          </p>

        )

      }








      {

        task.penalty > 0 &&

        (

          <p className="mt-2 text-sm text-red-500">

            ⚠️ 逾期扣 {task.penalty} 阿寶幣

          </p>

        )

      }








      {

        latestComment &&

        (

          <div className="mt-3 rounded-2xl bg-[#fff5dc] p-3">


            <p className="text-xs text-gray-500">

              💬 最新留言

            </p>


            <p className="mt-1 font-bold">

              {latestComment.content}

            </p>


          </div>

        )

      }








      <p className="mt-3 text-sm text-gray-600">

        狀態：

        {task.status}

      </p>



    </>

  );

}









const SortableItem = memo(function SortableItem({

  task,

  completed=false,


}:{

  task:any;

  completed?:boolean;

}){



  const {

    attributes,

    listeners,

    setNodeRef,

    transform,

    transition,

    isDragging,

  } = useSortable({

    id:task.id,

  });






  const style={


    transform:CSS.Transform.toString(transform),


    transition,


  };







  return (



    <div


      ref={setNodeRef}


      style={style}


      className={`

        rounded-3xl

        p-5

        shadow

        transition


        ${

          completed

          ?

          "bg-gray-100"

          :

          "bg-white"

        }


        ${

          isDragging

          ?

          "opacity-40 scale-95"

          :

          ""

        }

      `}


    >







      <div className="flex gap-3">



        <button


          {...attributes}


          {...listeners}


          className="

            cursor-grab

            active:cursor-grabbing

            text-2xl

            select-none

            touch-none

          "


        >

          ☷


        </button>







        <Link


          href={`/tasks/${task.id}`}


          className="flex-1"


        >


          <TaskContent task={task}/>


        </Link>



      </div>







      {

        !completed

        &&

        task.status !== "已完成"

        &&

        task.status !== "等待核可"

        &&


        (
          <CompleteButton
           id={task.id}
           status={task.status}
            assignTo={task.assign_to}
/>


        )

      }





    </div>



  );


});
function DragCard({

  task,

}:{

  task:any;

}){


  return (

    <div

      className="
        rounded-3xl
        bg-white
        p-5
        shadow-2xl
        scale-105
      "

    >


      <div className="flex gap-3">


        <div className="text-2xl">

          ☷

        </div>


        <div className="flex-1">

          <TaskContent task={task}/>

        </div>


      </div>


    </div>

  );

}









export default function SortableTaskList({

  tasks,

  completed=false,

}:{

  tasks:any[];

  completed?:boolean;

}){



  const [items,setItems] = useState(tasks);


  const [activeTask,setActiveTask] =

    useState<any>(null);



  const [pointerY,setPointerY] =

    useState(0);







  // 同步最新資料

  useEffect(()=>{


    setItems(tasks);


  },[tasks]);









  const sensors = useSensors(


    useSensor(

      PointerSensor,

      {

        activationConstraint:{

          distance:5,

        },

      }

    )


  );










  // 追蹤拖曳位置

  useEffect(()=>{


    function move(e:PointerEvent){


      setPointerY(e.clientY);


    }




    window.addEventListener(

      "pointermove",

      move

    );





    return ()=>{


      window.removeEventListener(

        "pointermove",

        move

      );


    };


  },[]);









  // 自動滾動

  useEffect(()=>{


    if(!activeTask)

      return;





    const timer=setInterval(()=>{


      const height = window.innerHeight;


      const edge = 120;





      if(pointerY < edge){


        window.scrollBy(

          0,

          -12

        );


      }





      if(pointerY > height-edge){


        window.scrollBy(

          0,

          12

        );


      }




    },20);






    return ()=>{


      clearInterval(timer);


    };



  },[

    activeTask,

    pointerY

  ]);









  async function saveOrder(

    newItems:any[]

  ){



    await fetch(

      "/api/tasks/order",

      {

        method:"PATCH",

        headers:{

          "Content-Type":

          "application/json",

        },


        body:JSON.stringify({

          tasks:

          newItems.map(

            (task,index)=>(


              {

                id:task.id,

                sort_order:index,

              }


            )

          ),

        }),


      }

    );


  }









  function handleDragStart(event:any){



    const task = items.find(

      item=>item.id===event.active.id

    );



    setActiveTask(task);


  }










  function handleDragEnd(event:any){


    const {

      active,

      over,

    } = event;





    setActiveTask(null);






    if(!over)

      return;






    if(active.id !== over.id){



      const oldIndex = items.findIndex(

        item=>item.id===active.id

      );



      const newIndex = items.findIndex(

        item=>item.id===over.id

      );






      const newItems = arrayMove(

        items,

        oldIndex,

        newIndex

      );





      setItems(newItems);


      saveOrder(newItems);



    }



  }









  return (



    <DndContext


      id="task-dnd"


      sensors={sensors}


      collisionDetection={closestCenter}


      onDragStart={handleDragStart}


      onDragEnd={handleDragEnd}


      onDragCancel={()=>setActiveTask(null)}


    >





      <SortableContext


        items={items.map(

          item=>item.id

        )}


        strategy={verticalListSortingStrategy}


      >



        <div className="space-y-4">


          {

            items.map(task=>(


              <SortableItem


                key={task.id}


                task={task}


                completed={completed}


              />


            ))

          }



        </div>



      </SortableContext>









      <DragOverlay>


        {

          activeTask &&


          (

            <DragCard

              task={activeTask}

            />

          )


        }


      </DragOverlay>







    </DndContext>


  );


}