// pages/index.js
"use client"
import Popup from 'reactjs-popup';
import { useEffect, useState } from 'react';
import Team from './component/Team.js';
import axios, { all } from 'axios';
export default function Home() {

  const options = [
    "MFA",
    "Strong Password",
    "Data Backup",
    "IDS/IPS",
    "Account Lockout",
    "VPN",
    "Secure DNS",
    "DNSSEC",
    "Input and Output Encoding",
    "CSP",
    "DNS Filtering",
    "ORM",
    "Prepared Statements",
    "Access Control Monitoring",
    "Least Privilege",
    "SID Regeneration",
    "Session Timeout",
    "Encryption",
    "Strict Session",
    "Regular password changes",
    "Input Validation and Sanitization",
    "Firewall",
    "Establish Clear IT Policies"
  ];




  const [open, setOpen] = useState(false);

  // Function to open the modal
  const openModal = () => setOpen(true);

  // Function to close the modal
  const closeModal = () => setOpen(false);


  const [selectedOptions, setSelectedOptions] = useState(Array(5).fill(''));
  const [allCard, setAllCard] = useState([]);
  const [countCard, setCountCard] = useState(160);
  const [teamEventCards,setTeamEventCards] = useState([
    [],[],[],[],[]
  ])
  const [turn ,setTurn] = useState(1);
  const [addedTechnologies, setAddedTechnologies] = useState(Array(5).fill([])); // Stores the added technologies
  const [centerCards,setCenterCard] = useState([])
  const [dataLevel, setDataLevel] = useState({
    Knowledge: 0,
    Norton: 0,
    Bitdefender: 0,
    "Avira Antivirus": 0,
    McAfee: 0,
    Windows: 0,
    Linux: 0
  })
  const [activeCards, setActiveCard] = useState([])


  useEffect(() => {
    // Making a request to an external API
    axios.get('http://localhost:3000/api/card/getcard')
      .then(response => {
        setAllCard(response.data); // Set the data from the API
        // console.log(response.data);
      })
      .catch(error => {
        setError(error); // Handle errors
      });
  }, []);

  useEffect(() => {
    let randDomIndex = Math.floor(Math.random()*countCard);
    // console.log(randDomIndex)
    if(allCard.data){
      let newElemet = allCard.data[randDomIndex];
      setCenterCard([...centerCards, newElemet])
      // console.log((allCard.data[randDomIndex]));
      // console.log(typeof(allCard.data[randDomIndex]));
    }

    for (let i = 0 ; i < 5 ; i++){
      let randDomIndex = Math.floor(Math.random()*countCard);
      if(allCard.data){
        let newElemet = allCard.data[randDomIndex];
        let updateList = teamEventCards;
        let news = updateList[i];
        news.push(newElemet);
        updateList[i] = news;
        setTeamEventCards(updateList)
      }
    }

    console.log(teamEventCards)
  }, [turn])

  useEffect(() => {
    const postData = async (index,list) => {
      try {
        const response = await axios.post('http://localhost:3000/api/team/updateteam', {
          teamId: index,
          teamEventCards: list  // Empty array for teamevent
        });
        
        console.log('Response:', response.data);  // Handle successful response
      } catch (error) {
        console.error('Error posting data:', error);  // Handle error
      }
    };
    for(let i = 0 ; i < 6 ; i++)
    {
      if(i == 0)
      {
        postData(0,centerCards);
      }
      else 
      {
        postData(i,teamEventCards[i-1])
      }
    }
      // Call the async function
  }, [centerCards,turn])

  const handChangeLevel = (keyID, operat) => {
    if (operat === '-') {
      setDataLevel(preData => ({
        ...preData, [keyID]: Math.max(preData[keyID] - 1, 0)
      }))
    }
    else if (operat === '+') {
      setDataLevel(preData => ({
        ...preData, [keyID]: preData[keyID] + 1 
      }))
    }
  }

  // Handle option change for a specific team
  const handleSelectChange = (index) => (event) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = event.target.value;
    setSelectedOptions(newSelectedOptions);
  };

  // Handle adding the selected technology to the team
  const handleAdd = async (index) => {
    const selectedTechnology = selectedOptions[index];

    // POST data to an API
    try {
      const res = await fetch('/api/team/updatedefcard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team: index + 1,
          technology: selectedTechnology,
        }),
      });

      const data = await res.json();
      console.log(data.message);

      if (res.ok) {
        // Update added technologies for the specific team
        const newAddedTechnologies = [...addedTechnologies];
        newAddedTechnologies[index] = [
          ...newAddedTechnologies[index],
          selectedTechnology
        ];

        setAddedTechnologies(newAddedTechnologies);

        // Clear the selected option
        setSelectedOptions((prev) => {
          const newSelectedOptions = [...prev];
          newSelectedOptions[index] = '';
          return newSelectedOptions;
        });
      }
    } catch (error) {
      console.error('Error adding technology:', error);
    }
  };

  return (
    <div className="h-dvh ">
      {/* Main container */}
      <div className='grid grid-rows-6 bg-gray-100 p-2 gap-5'>
        <div className="grid grid-cols-3 row-span-3 gap-4">

          {/* Center Card */}
          {/* <div className="col-span-1 flex justify-center items-center">
            
          </div> */}

          {/* Team Manager + List */}
          <div className="col-span-1 bg-white grid grid-cols-2 shadow-lg p-4">
            <div className='text-black flex flex-col items-center py-5 gap-5'>
              <h1 className='text-2xl'>Global Event</h1>
              {/* <div className="w-40 h-60 bg-purple-600 text-white flex items-center justify-center">
                <h1 className="text-black">Card</h1>
              </div> */}
              <div className='flex flex-col items-center gap-3'>
                <img src="https://i.ibb.co/V94BZC5/1.jpg'" className='w-4/5' />
                <h1>Card Stack : {centerCards.length}</h1>
              </div>
            </div>
            <div className='grid grid-rows-6 gap-1 '>
              {Object.entries(dataLevel).map(([key, value], index) => (
                <div className='text-black flex justify-between items-center'>
                  {key}
                  <div className='flex items-center gap-4'>
                    <button className='btn btn-secondary' onClick={() => { handChangeLevel(key, '-') }}>-</button>
                    <h1>{value}</h1>
                    <button className='btn btn-secondary' onClick={() => { handChangeLevel(key, '+') }}>+</button>
                  </div>
                </div>

              ))}
            </div>
          </div>
          <div className='col-span-2 bg-white shadow-lg text-black grid grid-rows-11 p-2' >
            <div className='flex justify-between items-center row-span-2 '>
              <h1 className='text-2xl '>Active Card</h1>
              <div className='flex items-center gap-5'>
                <h1 className='text-2xl'>Turn : {turn}</h1>
                <button className='bg-green-500 p-5 text-white' onClick={()=>{setTurn(preturn => (preturn + 1))}}>Next Turn</button>
              </div>
            </div>
            <div className='grid grid-cols-6 row-span-9 gap-2 items-center ' >
              <div className='shadow-2xl flex flex-col items-center' onClick={openModal}>
                <div>All Teams</div>
                <img src='https://i.ibb.co/BPbs6Yq/37.jpg' alt="Card" />
                <div className='flex justify-between gap-2'>
                  <h1>C: -45</h1>
                  <h1>I: -35</h1>
                  <h1>A: -25</h1>
                </div>
              </div>
            </div>
          </div>

          {/* Pop-up Modal */}
          <Popup open={open} closeOnDocumentClick onClose={closeModal} modal nested>
            {close => (
              <div className="text-black">
                <button className="close" onClick={close}>&times;</button>
                <div className='bg-white flex flex-col items-center p-4'>
                  <div>All Teams</div>
                  <img src='https://i.ibb.co/BPbs6Yq/37.jpg' alt="Card" className="w-96" />
                  <div className='flex justify-between gap-8 text-xl mt-4'>
                    <h1>C: -45</h1>
                    <h1>I: -35</h1>
                    <h1>A: -25</h1>
                  </div>
                </div>
              </div>
            )}
          </Popup>
        </div>
        <div className='row-span-3 grid grid-cols-5 gap-5'>
          <Team id={1} turn={turn} stackSize={teamEventCards[0].length}/>
          <Team id={2} turn={turn} stackSize={teamEventCards[1].length}/>
          <Team id={3} turn={turn} stackSize={teamEventCards[2].length}/>
          <Team id={4} turn={turn} stackSize={teamEventCards[3].length}/>
          <Team id={5} turn={turn} stackSize={teamEventCards[4].length}/>
        </div>
      </div>
    </div>
  );
}
