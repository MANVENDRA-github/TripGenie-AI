"use client"

import React, { use, useEffect, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader, Send } from 'lucide-react'
import axios from 'axios'
import EmptyBoxState from './EmptyBoxState'
import GroupSizeUi from './GroupSizeUi'
import BudgetUi from './BudgetUi'
import SelectDaysUi from './SelectDaysUi'
import FinalUi from './FinalUi'

type Message={
    role:string,
    content:string,
    ui?:string,
}

function ChatBox() {

    const [messages, setMessages]= useState<Message[]>([]);

    const [userInput, setUserInput] = useState<string>();

    const [loading, setLoading]= useState<boolean>(false);

    const [ isFinal, setIsFinal] = useState<boolean>(false);
    
    const onSend = async (text?: string) => {
        const messageText = text ?? userInput;

            if (!messageText?.trim()) return;

            setLoading(true);
            setUserInput('');

        const newMsg: Message = {
            role: 'user',
            content: messageText
        };

    
        setMessages((prev:Message[])=>[...prev, newMsg]);


        const result = await axios.post('/api/aimodel',{
            messages:[...messages, newMsg],
            isFinal:isFinal
        });

        console.log("TRIP",result.data);

        !isFinal && setMessages((prev:Message[])=>[...prev, {
            role:'assistant',
            content:result?.data?.resp,
            ui:result?.data?.ui
        }]);

    setLoading(false);
}

const RenderGenerativeUI = (ui:string)=>{

    if(ui=='budget'){
        //budget ui component
        return <BudgetUi onSelectedOption={(v:string)=>{setUserInput(v);onSend()}}/>;

    }else if(ui=='groupSize'){
        //group size ui component

        return <GroupSizeUi onSelectedOption={(v:string)=>{setUserInput(v);onSend()}}/>;

    }else if(ui=='tripDuration'){
        //trip duration ui component
        return <SelectDaysUi onSelectedOption={(v:string)=>{setUserInput(v);onSend()}}/>;
    }else if (ui=='final'){
        //final ui component
        return <FinalUi viewTrip={()=> console.log()} />;
    }
    return null;
}

useEffect(()=>{
    const lastMsg = messages[messages.length -1];
    if(lastMsg?.ui=="final"){
        setIsFinal(true);
        setUserInput('Ok, Great');
        onSend();
    }
},[messages])

  return (
    <div className='h-[80vh] flex flex-col '>
        {messages?.length==0 &&
            <EmptyBoxState 
            onSelectOption={(v:string)=>
                {setUserInput(v);
                //onSend(v)
            }} 
            />
        }
        {/*to display chat messages*/}
        <section className='flex-1 overflow-y-auto p-4'>
            {messages.map((msg:Message, index)=>(
                msg.role=='user'?
                <div className='flex justify-end mt-2' key={index}>
                    <div className='max-w-lg bg-gray-200 text-black px-4 py-2 rounded-lg'>
                        {msg.content}
                    </div>
                </div>:
                <div className='flex justify-start mt-2' key={index}>
                    <div className='max-w-lg bg-gray-200 text-black px-4 py-2 rounded-lg'>
                        {msg.ui !== 'final' && msg.content}
                        {RenderGenerativeUI(msg.ui ?? '')}
                    </div>
                </div>
                
            ))}
            {loading &&<div className='flex justify-start mt-2'>
                    <div className='max-w-lg bg-gray-200 text-black px-4 py-2 rounded-lg'>
                        <Loader className='animate-spin'/>
                    </div>
            </div>}
            
        </section>
        {/*input box*/}
        <section>
            <div className='border rounded-2xl p-4 relative'>
                <Textarea placeholder="Type your message here..." 
                className='w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none'
                onChange={(event)=>setUserInput(event.target.value ??'')}
                value={userInput}
                 />
                <Button size={'icon'} className='absolute bottom-6 right-6 cursor-pointer' onClick={()=>onSend()}>
                  <Send className='w-4 h-4' />
                </Button>
            </div>
        </section>
    </div>
  )
}

export default ChatBox