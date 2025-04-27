import React from "react";
import "./styles/faculty.css";

const facultyData = [
  {
    "Name": "Dr. Peplluis Esteva de la Rosa",
    "Designation": "Executive Dean - School of Technology",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/F20241106112340.webp"
  },
  {
    "Name": "Amogh Deshmukh",
    "Designation": "Assistant Dean – Student Affairs",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/F20230602062212.webp"
  },
  {
    "Name": "Dr Amit Swamy",
    "Designation": "Associate Dean and Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/A20241119113327.webp"
  },
  {
    "Name": "Dr. Daya Shankar",
    "Designation": "Dean- School of Sciences",
    "School": "School of Sciences",
    "ImageURL": "https://woxsen.edu.in/uploads/F20250402042507.webp"
  },
  {
    "Name": "Dr. Beauty Pandey",
    "Designation": "Associate Dean",
    "School": "School of Sciences",
    "ImageURL": "https://woxsen.edu.in/uploads/F20230602063758.webp"
  },
  {
    "Name": "Dr. Naveed Jeelani Khan",
    "Designation": "Assistant Dean – Frontier Technologies Hub",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/A20240916091449.webp"
  },
  {
    "Name": "Dr. Purushotham Muniganti",
    "Designation": "Assistant Dean – International Relations",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/A20230703073320.webp"
  },
  {
    "Name": "Dr. Sarah Mariam Roy",
    "Designation": "Assistant Dean – Academic Affairs",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/A20230812084725.webp"
  },
  {
    "Name": "Dr. Rama Rao KVSN",
    "Designation": "Assistant Dean – Corporate Alignment",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/A20241203125159.webp"
  },
  {
    "Name": "Prof. Venkata Satya Madhav M",
    "Designation": "Professor of Practice",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/A20250107011239.webp"
  },
  {
    "Name": "Dr. Brundaban Mishra",
    "Designation": "Dipesh Chakrabarty Professor of History",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/F20230602065539.webp"
  },
  {
    "Name": "Prof. P Venkata Narayana",
    "Designation": "Professor & Director Research –VP OFFICE",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/A20241025100041.webp"
  },
  {
    "Name": "Dr. Bhargav Prajwal Pathri",
    "Designation": "Associate Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/F20230602063021.webp"
  },
  {
    "Name": "Dr. Venkata Narayan P",
    "Designation": "Assistant Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/F20230602063244.webp"
  },
  {
    "Name": "Dr. Bhanu Prakash S",
    "Designation": "Assistant Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/F20230602063453.webp"
  },
  {
    "Name": "Dr. Prashant Kumar",
    "Designation": "Assistant Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/F20230602063512.webp"
  },
  {
    "Name": "Dr. Indranath Chatterjee",
    "Designation": "Adjunct Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/F20230602065120.webp"
  },
  {
    "Name": "Prof. Subin Scaria",
    "Designation": "Assistant Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/F20230602063727.webp"
  },
  {
    "Name": "Dr. Ram Murat Singh",
    "Designation": "Assistant Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/A20230812082042.webp"
  },
  {
    "Name": "Prof. Sunil Kumar Tiwari",
    "Designation": "Assistant Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/A20230925094949.webp"
  },
  {
    "Name": "Dr. Amlan Kanti Halder",
    "Designation": "Asistant Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/A20240212020451.webp"
  },
  {
    "Name": "Dr. Kamil Reza K",
    "Designation": "Assistant Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/F20240213020036.webp"
  },
  {
    "Name": "Dr. Dharmendra Kr Mishra",
    "Designation": "Assistant Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/A20240212025758.webp"
  },
  {
    "Name": "Dr. Venkat Reddy P",
    "Designation": "Assistant Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/A20240212020553.webp"
  },
  {
    "Name": "Sandeep Dasari",
    "Designation": "Assistant Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/A20240326035816.webp"
  },
  {
    "Name": "Prof. Anand Kakarla",
    "Designation": "Assistant Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/A20240405044908.webp"
  },
  {
    "Name": "Prof. Vaishali Thakur",
    "Designation": "Assistant Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/A20240423043014.webp"
  },
  {
    "Name": "Dr. Abhaya Kumar Pradhan",
    "Designation": "Assistant Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/F20240424041739.webp"
  },
  {
    "Name": "Prof. Meher Gayatri Devi",
    "Designation": "Assistant Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/F20240814084459.webp"
  },
  {
    "Name": "Dr. Segun Emmanuel Ibitoye",
    "Designation": "Assistant Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/A20240813084009.webp"
  },
  {
    "Name": "Dr. Abdullahi Jubrin Monday",
    "Designation": "Assistant  Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/A20241008101205.webp"
  },
  {
    "Name": "Dr. Kiran Siripuri",
    "Designation": "Assistant Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/A20241120112729.webp"
  },
  {
    "Name": "Dr. Thasni T",
    "Designation": "Assistant Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/F20241121114226.webp"
  },
  {
    "Name": "Prof. Vuppula Roopa",
    "Designation": "Assistant Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/A20241204120320.webp"
  },
  {
    "Name": "Dr Syed Javeed Pasha",
    "Designation": "Assistant Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/A20241216123652.webp"
  },
  {
    "Name": "Dr. Ajit Kumar",
    "Designation": "Assistant Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/A20241216124255.webp"
  },
  {
    "Name": "Dr. Ajin R Nair",
    "Designation": "Assistant Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/A20250106010550.webp"
  },
  {
    "Name": "Prof. Annapurna Pradhan",
    "Designation": "Assistant Professor",
    "School": "School of Technology",
    "ImageURL": "https://woxsen.edu.in/uploads/A20250107010402.webp"
  },
  {
    "Name": "Dr. Ramakrishna Madaka",
    "Designation": "Assistant Dean – Student Affairs",
    "School": "School of Sciences",
    "ImageURL": "https://woxsen.edu.in/uploads/F20230602063821.webp"
  },
  {
    "Name": "Dr. Dipak Kumar Sahoo",
    "Designation": "Assistant Dean – Academic Affairs",
    "School": "School of Sciences",
    "ImageURL": "https://woxsen.edu.in/uploads/F20230602065223.webp"
  },
  {
    "Name": "Dr. Madhuri Pola",
    "Designation": "Assistant Dean – Corporate Alignment",
    "School": "School of Sciences",
    "ImageURL": "https://woxsen.edu.in/uploads/A20241205124346.webp"
  },
  {
    "Name": "Dr. Vishal Anand",
    "Designation": "Assistant Dean – International Relations",
    "School": "School of Sciences",
    "ImageURL": "https://woxsen.edu.in/uploads/A20241205120139.webp"
  },
  {
    "Name": "Dr. Ravilisetty Revathi",
    "Designation": "Assistant Professor",
    "School": "School of Sciences",
    "ImageURL": "https://woxsen.edu.in/uploads/F20230602063503.webp"
  },
  {
    "Name": "Dr. T Santhosh Kumar",
    "Designation": "Assistant Professor",
    "School": "School of Sciences",
    "ImageURL": "https://woxsen.edu.in/uploads/A20231226123320.webp"
  },
  {
    "Name": "Dr. Shouvik Chakraborty",
    "Designation": "Assistant Professor",
    "School": "School of Sciences",
    "ImageURL": "https://woxsen.edu.in/uploads/A20240326031012.webp"
  },
  {
    "Name": "Dr. Amit Kumar Singh",
    "Designation": "Assistant Professor",
    "School": "School of Sciences",
    "ImageURL": "https://woxsen.edu.in/uploads/A20240813084719.webp"
  },
  {
    "Name": "Dr. Sudarshana Santhosh K",
    "Designation": "Assistant Professor",
    "School": "School of Sciences",
    "ImageURL": "https://woxsen.edu.in/uploads/A20241008100240.webp"
  },
  {
    "Name": "Dr. Suman Chirra",
    "Designation": "Assistant Professor",
    "School": "School of Sciences",
    "ImageURL": "https://woxsen.edu.in/uploads/A20241022104830.webp"
  },
  {
    "Name": "Dr. Ayan Banerjee",
    "Designation": "Assistant Professor",
    "School": "School of Sciences",
    "ImageURL": "https://woxsen.edu.in/uploads/A20241203121438.webp"
  },
  {
    "Name": "Dr. Thota Srikar",
    "Designation": "Assistant Professor",
    "School": "School of Sciences",
    "ImageURL": "https://woxsen.edu.in/uploads/A20241204124845.webp"
  },
  {
    "Name": "Dr. Soumyadip Patra",
    "Designation": "Assistant Professor",
    "School": "School of Sciences",
    "ImageURL": "https://woxsen.edu.in/uploads/A20241204120257.webp"
  },
  {
    "Name": "Dr. Bidisha Roy",
    "Designation": "Assistant Professor",
    "School": "School of Sciences",
    "ImageURL": "https://woxsen.edu.in/uploads/A20241216124852.webp"
  },
  {
    "Name": "Dr. Bixapathi Banoth Nayak",
    "Designation": "Assistant Professor",
    "School": "School of Sciences",
    "ImageURL": "https://woxsen.edu.in/uploads/A20241216125236.webp"
  },
  {
    "Name": "Dr. Jagoba Rey",
    "Designation": "Assistant Professor",
    "School": "School of Sciences",
    "ImageURL": "https://woxsen.edu.in/uploads/A20241216120258.webp"
  },
  {
    "Name": "Dr. Venkata Narayana P",
    "Designation": "Assistant professor",
    "School": "School of Sciences",
    "ImageURL": "https://woxsen.edu.in/uploads/A20241216125057.webp"
  },
  {
    "Name": "Dr. Heeramoni Boro",
    "Designation": "Assistant professor",
    "School": "School of Sciences",
    "ImageURL": "https://woxsen.edu.in/uploads/A20250107014006.webp"
  },
  {
    "Name": "Dr. Basu Bhattacharjee",
    "Designation": "Assistant Professor",
    "School": "School of Sciences",
    "ImageURL": "https://woxsen.edu.in/uploads/A20250213022757.webp"
  }
];

const FacultyPage = () => {
  return (
    <div className="faculty-page">
      <h1 className="faculty-title">Meet Our Faculty</h1>
      <div className="faculty-grid">
        {facultyData.map((faculty, index) => (
          <div className="faculty-card" key={index}>
            <img
              src={faculty.ImageURL}
              alt={faculty.Name}
              className="faculty-image"
            />
            <h3>{faculty.Name}</h3>
            <p>{faculty.Designation}</p>
            <p>{faculty.School}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyPage;
