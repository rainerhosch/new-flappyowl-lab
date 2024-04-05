 // eslint-disable-next-line
import React, { useEffect, useState } from 'react';
 // eslint-disable-next-line
import axios from 'axios';

const ReferralLinkGenerator = ({ address }) => {
    const [referralLink, setReferralLink] = useState('');
    // const [message, setMessage] = useState('');
    // const [data, setData] = useState([]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //       try {
    //         const response = await axios.get('/v1/api/user');
    //         setData(response.data);
    //       } catch (error) {
    //         console.error('Error fetching data:', error);
    //       }
    //     };
    
    //     fetchData();
    //   }, []);
    //   console.log(data)


    const generateReferralLink = () => {
        // Generate a unique referral link (e.g., using a combination of user ID and timestamp)
        if(address != null){
            const uniqueReferralLink = `https://localhost:3000/vault?ref=${address}`;
            setReferralLink(uniqueReferralLink);
        }
    };


//   const handleSaveData = () => {
//     try {
//         generateReferralLink()
//         const user_data = {
//             user:address,
//             ref_count:0,
//             ref_uri:referralLink
//         }
//         // Convert data to JSON string
//         const jsonData = JSON.stringify(user_data);
        
//         // console.log(user_data)

//       // Save JSON data to localStorage
//     //   localStorage.setItem('../assets', jsonData);

//       setMessage('Data saved successfully!');
//     } catch (error) {
//       setMessage('Error saving data: ' + error.message);
//     }
//   };
 // eslint-disable-next-line
  const generateUniqueId = () => {
    // Generate a unique ID (e.g., using Math.random() or a library like uuid)
    return Math.random().toString(36).substring(2, 10);
  };

  return (
    <div>
      <button className='btn btn-sm btn-dark' onClick={generateReferralLink}>View Referral Link</button>
      <p className='text-sm mt-3'>{referralLink && `${referralLink}`}</p>
      {/* {message} */}
    </div>
  );
};

export default ReferralLinkGenerator;
