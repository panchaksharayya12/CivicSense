import { Complaint, CivicDomain, ComplaintSeverity } from "@/types";

export interface ScheduleOfRateItem {
  code: string;
  item: string;
  quantity: string;
  unitRate: string;
  totalAmount: string;
}

export interface DomainReportTemplate {
  formCode: string;
  formTitle: string;
  departmentName: string;
  targetOfficerDesignation: string;
  defaultOfficerName: string;
  targetOfficerEmail: string;
  targetOfficerPhone: string;
  statutoryAct: string;
  regulatoryCode: string;
  sopReference: string;
  hazardClassification: string;
  defaultSlaHours: number;
  diagnosticMetrics: { label: string; value: string }[];
  machineryChecklist: string[];
  materialsChecklist: string[];
  crewRequirement: string[];
  scheduleOfRates: ScheduleOfRateItem[];
  totalEstimatedCost: string;
  actionProtocol: string[];
  penalNotice: string;
}

export interface GovernmentReportData {
  memoNumber: string;
  dispatchDate: string;
  dispatchTime: string;
  qrVerificationCode: string;
  complaint: Complaint;
  template: DomainReportTemplate;
  wardNumber: string;
  zoneName: string;
  customOfficerName?: string;
  customDepartmentName?: string;
  customSlaHours?: number;
  customNotes?: string;
  slaDeadlineDate: string;
  mapsUrl: string;
}

/**
 * Returns tailored government reporting configuration based on complaint category & issue type
 */
export function getDomainReportTemplate(category: CivicDomain, issueType: string, severity: ComplaintSeverity): DomainReportTemplate {
  const normCategory = (category || "traffic").toLowerCase();
  const normIssue = (issueType || "").toLowerCase();

  // 1. ROADS & TRAFFIC / POTHOLES
  if (normCategory === "traffic" || normIssue.includes("pothole") || normIssue.includes("road")) {
    return {
      formCode: "FORM R-14 / PWD-MRTD",
      formTitle: "STATUTORY REQUISITION FOR EMERGENCY CARRIAGEWAY & POTHOLE REPAIR",
      departmentName: "Public Works Department (PWD) / Municipal Roads Maintenance Wing",
      targetOfficerDesignation: "The Executive Engineer (Roads & Bridges Division)",
      defaultOfficerName: "Er. Ramesh Kumar, M.Tech (Civil)",
      targetOfficerEmail: "ee.roads.zone4@municipalcorp.gov.in",
      targetOfficerPhone: "+91 94480 12345",
      statutoryAct: "Section 198A of The Motor Vehicles Act 1988 (Failure of Road Authorities to Maintain Design Standards)",
      regulatoryCode: "IRC:82-2015 Guidelines for Maintenance of Bituminous Road Surfaces",
      sopReference: "MoRTH Section 3004 / IRC Special Publication 98 (Pavement Distress Mitigation)",
      hazardClassification: severity === "critical" || severity === "high" 
        ? "Class-A Severe Accident & Two-Wheeler Skid Impasse" 
        : "Class-B Carriageway Deformation & Traffic Slowdown",
      defaultSlaHours: severity === "critical" ? 24 : severity === "high" ? 48 : 72,
      diagnosticMetrics: [
        { label: "Pavement Distress Type", value: "Bituminous Top-Course Shear Failure & Sub-grade Crater Formation" },
        { label: "Estimated Surface Area", value: "3.2m x 2.4m (Depth: 85mm - 120mm)" },
        { label: "Traffic Volume Exposure", value: "High-density mixed urban corridor (12,000+ PCU/day)" },
        { label: "Water Intrusion Hazard", value: "Active edge pooling risking sub-base foundation liquefaction" },
      ],
      machineryChecklist: [
        "1x Mobile Bituminous Hot-Mix Carrier (Mini-Paver unit)",
        "1x 8-Ton Tandem Vibratory Compaction Roller",
        "1x High-Pressure Pneumatic Air Compressor for Dust Clearance",
        "1x Rapid Cut-Back Bitumen Emulsion Sprayer",
        "Site Safety: 6x High-Visibility Retro-reflective Cones & Flashing Hazard Beacon",
      ],
      materialsChecklist: [
        "Rapid Setting Bitumen Emulsion (RS-1 Grade Tack Coat) - 40 kg",
        "Dense Bituminous Macadam (DBM) 60/70 Grade Aggregate - 1.8 MT",
        "Bituminous Concrete (BC) Wearing Surface Aggregate - 0.9 MT",
        "Stone aggregate dust for edge sealing - 200 kg",
      ],
      crewRequirement: [
        "1x Junior Engineer (On-site Works Supervisor)",
        "1x Heavy Vibratory Roller Operator",
        "1x Hot-Mix Machine Operator",
        "4x Skilled PWD Asphalt Road Gang Workers",
      ],
      scheduleOfRates: [
        { code: "PWD-SSR-04", item: "Saw-cutting crater edges & pneumatic debris extraction", quantity: "7.68 sq.m", unitRate: "₹450 / sq.m", totalAmount: "₹3,456" },
        { code: "PWD-SSR-12", item: "Application of RS-1 Bituminous Tack Coat @ 0.3 kg/sq.m", quantity: "7.68 sq.m", unitRate: "₹360 / sq.m", totalAmount: "₹2,764" },
        { code: "PWD-SSR-21", item: "Laying & mechanical compaction of Dense Bituminous Macadam (75mm)", quantity: "1.8 MT", unitRate: "₹7,800 / MT", totalAmount: "₹14,040" },
        { code: "PWD-SSR-29", item: "Bituminous Concrete (40mm) wearing surface finish & joint seal", quantity: "0.9 MT", unitRate: "₹8,400 / MT", totalAmount: "₹7,560" },
        { code: "PWD-SSR-88", item: "Site safety barricading, traffic marshaling & hazard signage", quantity: "1 Lump Sum", unitRate: "₹2,500 / site", totalAmount: "₹2,500" },
      ],
      totalEstimatedCost: "₹30,320 (Thirty Thousand Three Hundred Twenty Rupees)",
      actionProtocol: [
        "Step 1: Deploy retro-reflective caution barricades 30 meters upstream of carriageway hazard.",
        "Step 2: Saw-cut damaged pothole perimeter to clean rectangular vertical edges down to solid base.",
        "Step 3: Clear all loose aggregate and mud using pneumatic air lance.",
        "Step 4: Apply uniform tack coat of RS-1 bitumen emulsion on cavity base and vertical walls.",
        "Step 5: Lay hot mix asphalt at 145°C - 160°C and compact flush with vibratory roller.",
        "Step 6: Mandatorily capture before/after geo-tagged resolution media and upload to Civic Sense.",
      ],
      penalNotice: "Statutory notice under Section 198A of Motor Vehicles Act: Failure to rectify carriageway craters within the prescribed SLA invites punitive action and audit reporting to District Magistrate.",
    };
  }

  // 2. WATER SUPPLY & SEWERAGE / DRAINAGE
  if (normCategory === "water" || normIssue.includes("water") || normIssue.includes("sewage") || normIssue.includes("drainage") || normIssue.includes("pipe")) {
    return {
      formCode: "FORM W-09 / MWSSB-OPS",
      formTitle: "EMERGENCY STATUTORY ORDER: POTABLE PIPELINE BURST & SEWER RECTIFICATION",
      departmentName: "Water Supply & Sewerage Board (Jal Board / MWSSB)",
      targetOfficerDesignation: "Chief General Manager / Superintending Engineer (Water Works & Sewerage)",
      defaultOfficerName: "Er. Venkatesh Murthy, B.E. (Environmental Eng.)",
      targetOfficerEmail: "se.ops.waterboard@municipalcorp.gov.in",
      targetOfficerPhone: "+91 94481 67890",
      statutoryAct: "The Water (Prevention and Control of Pollution) Act 1974 & Central Public Health Environment Bylaws",
      regulatoryCode: "CPHEEO Manual on Water Supply and Treatment & Sewerage Systems (Ministry of Housing and Urban Affairs)",
      sopReference: "MWSSB Standard Emergency Feeder Repair Protocol Doc # 44-B",
      hazardClassification: severity === "critical" || severity === "high"
        ? "Tier-1 Imminent Drinking Water Contamination & Massive Resource Loss"
        : "Tier-2 Secondary Drainage Overflow & Water Supply Disruption",
      defaultSlaHours: severity === "critical" ? 12 : severity === "high" ? 24 : 48,
      diagnosticMetrics: [
        { label: "Pipeline Failure Class", value: "Underground Feeder Distribution Rupture / Manhole Sump Surcharge" },
        { label: "Estimated Loss Velocity", value: "9,500 - 14,000 Litres of Potable Water / Hour continuous loss" },
        { label: "Contamination Vulnerability", value: "Critical back-siphonage risk into neighboring domestic drinking lines" },
        { label: "Sub-Surface Cavitation", value: "Erosion of surrounding soil undermining asphalt road foundation" },
      ],
      machineryChecklist: [
        "1x High-Capacity Super Sucker Vacuum Suction & High-Pressure Jetting Tanker",
        "1x 75 HP High-Discharge Diesel Dewatering Sludge Sump Pump",
        "1x Mini Hydraulic Trench Excavator (JCB/Bobcat Backhoe)",
        "1x Portable Electrofusion Pipe Welder & Mechanical Flange Tool Kit",
        "1x Multi-Gas Detector (H2S, CH4, CO) for confined space safety",
      ],
      materialsChecklist: [
        "150mm / 200mm Heavy-Duty Ductile Iron (DI) Mechanical Repair Sleeve Collar",
        "EPDM Synthetic Food-Grade Rubber Gaskets & High-Tensile Stainless Steel Fasteners",
        "50 kg Calcium Hypochlorite (Chlorine Shock Dosage Disinfectant Granules)",
        "Coarse gravel aggregate for trench bed stabilization - 3.5 MT",
      ],
      crewRequirement: [
        "1x Assistant Executive Engineer (Water Operations)",
        "2x Certified High-Pressure Pipeline Welders & Mechanics",
        "1x Heavy Jetting Unit Operator",
        "4x Confined-Space Trained Sewerage & Waterworks Gang Personnel",
      ],
      scheduleOfRates: [
        { code: "JAL-SSR-08", item: "Emergency mechanical excavation & trench safety timber shoring", quantity: "1 Site", unitRate: "₹7,200 / unit", totalAmount: "₹7,200" },
        { code: "JAL-SSR-14", item: "Continuous dewatering & vacuum slurry extraction (6 hours)", quantity: "6 Hours", unitRate: "₹950 / hr", totalAmount: "₹5,700" },
        { code: "JAL-SSR-33", item: "Installation of DI mechanical repair collar sleeve & pressure gasket", quantity: "1 Assembly", unitRate: "₹18,500 / unit", totalAmount: "₹18,500" },
        { code: "JAL-SSR-45", item: "Disinfection flush & chlorine residual shock testing (>0.2 ppm)", quantity: "1 Pipeline Section", unitRate: "₹4,200 / test", totalAmount: "₹4,200" },
        { code: "JAL-SSR-52", item: "Trench gravel backfilling, compaction & carriageway surface dressing", quantity: "3.5 MT", unitRate: "₹1,400 / MT", totalAmount: "₹4,900" },
      ],
      totalEstimatedCost: "₹40,500 (Forty Thousand Five Hundred Rupees)",
      actionProtocol: [
        "Step 1: Dispatch emergency valving crew to isolate upstream distribution sluice valve.",
        "Step 2: Deploy dewatering sump pumps to lower water table below pipe invert elevation.",
        "Step 3: Excavate around pipe failure zone and clear compromised pipe perimeter.",
        "Step 4: Torque-mount high-strength Ductile Iron repair sleeve with EPDM synthetic seal.",
        "Step 5: Gradually repressurize line to 3.5 kg/cm² and conduct 30-minute zero-weeping inspection.",
        "Step 6: Inject shock chlorine disinfectant, flush line, and upload photographic verification to portal.",
      ],
      penalNotice: "Statutory Directive under Section 24 of Water Pollution Act: Unrectified sewage leakage or potable water contamination poses immediate epidemic danger and attracts direct departmental disciplinary enquiry.",
    };
  }

  // 3. SOLID WASTE & SANITATION
  if (normCategory === "waste" || normIssue.includes("waste") || normIssue.includes("garbage") || normIssue.includes("dump")) {
    return {
      formCode: "FORM S-22 / SWM-HPH",
      formTitle: "STATUTORY EPIDEMIC PREVENTATIVE REQUISITION: EMERGENCY SOLID WASTE CLEARANCE",
      departmentName: "Health & Solid Waste Management Directorate (SWM)",
      targetOfficerDesignation: "Assistant Medical Officer of Health (AMOH) & Zonal Sanitation Officer",
      defaultOfficerName: "Dr. K. S. Lakshmi, MBBS, DPH (Public Health)",
      targetOfficerEmail: "amoh.swm.zone4@municipalcorp.gov.in",
      targetOfficerPhone: "+91 94482 34567",
      statutoryAct: "Solid Waste Management (SWM) Rules 2016 (Rule 15) & National Green Tribunal (NGT) Environmental Standards",
      regulatoryCode: "Swachh Bharat Urban Municipal Solid Waste Operations Manual & Municipal Public Health Bylaws",
      sopReference: "SWM Protocol # SW-2016-CLEARANCE (Rapid Nuisance Abatement)",
      hazardClassification: severity === "critical" || severity === "high"
        ? "Biohazard Level-2: Severe Vector-Borne Pathogen & Leachate Inundation"
        : "Standard Municipal Solid Waste Nuisance & Public Pathway Encroachment",
      defaultSlaHours: severity === "critical" ? 12 : severity === "high" ? 24 : 36,
      diagnosticMetrics: [
        { label: "Accumulated Waste Volume", value: "Estimated 4.0 - 6.5 Metric Tonnes mixed municipal solid waste" },
        { label: "Pathogen Breeding Risk", value: "Severe larval gestation threat for Dengue / Malaria vector mosquitos" },
        { label: "Leachate & Toxic Drainage", value: "Active black leachate fluid seeping into roadside stormwater conduit" },
        { label: "Air & Public Odour Impact", value: "Hydrogen sulfide & methane gaseous emissions impacting radius of 200m" },
      ],
      machineryChecklist: [
        "2x Hydraulic Rear-Loading Compactor Refuse Transport Trucks (14 Cu.m Capacity)",
        "1x Bobcat / JCB Front-End Skid Steer Earthmover Loader",
        "1x High-Pressure Motorized Bio-Sanitizer Wash Tanker",
        "1x Thermal Fogging Machine for Insecticidal Vector Control",
      ],
      materialsChecklist: [
        "75 kg Hydrated Bleaching Powder (Chlorinated Lime 33% Available Chlorine)",
        "15 Litres Organic Bio-Enzyme Odour Neutralizing Concentrate",
        "5 Litres Deltamethrin / Pyrethrum 2% Larvicidal Emulsion",
        "2x Heavy-Duty Galvanized Municipal Refuse Bins (1100 Litres)",
      ],
      crewRequirement: [
        "1x Chief Sanitation Inspector (CSI)",
        "2x Heavy Compactor Truck Drivers",
        "1x Skid-Steer Heavy Loader Operator",
        "6x Safai Karamcharis (Sanitation Personnel) equipped with Level-3 PPE & Heavy Nitrile Gloves",
      ],
      scheduleOfRates: [
        { code: "SWM-SSR-03", item: "Mechanical loading and transport of solid waste to waste-to-energy plant", quantity: "5.5 MT", unitRate: "₹1,600 / MT", totalAmount: "₹8,800" },
        { code: "SWM-SSR-07", item: "Manual sweeping, raking, and deep pavement surface clearing", quantity: "1 Lump Sum", unitRate: "₹3,200 / site", totalAmount: "₹3,200" },
        { code: "SWM-SSR-19", item: "High-pressure washdown with bio-enzyme microbial odour neutralizer", quantity: "1 Treatment", unitRate: "₹4,500 / site", totalAmount: "₹4,500" },
        { code: "SWM-SSR-24", item: "Vector control thermal fogging and anti-larval bleaching powder barrier", quantity: "1 Perimeter", unitRate: "₹2,800 / perimeter", totalAmount: "₹2,800" },
        { code: "SWM-SSR-31", item: "Installation of statutory 'NO DUMPING - ₹5000 PENALTY' municipal signpost", quantity: "1 Unit", unitRate: "₹1,800 / board", totalAmount: "₹1,800" },
      ],
      totalEstimatedCost: "₹21,100 (Twenty-One Thousand One Hundred Rupees)",
      actionProtocol: [
        "Step 1: Secure site perimeter and deploy mechanical loader to excavate bulk garbage pile.",
        "Step 2: Transfer all solid waste into enclosed hydraulic compactor trucks with sealed leachate tanks.",
        "Step 3: Perform thorough manual rake sweeping down to bare pavement surface.",
        "Step 4: Execute high-pressure washdown using certified biodegradable enzymatic sanitizers.",
        "Step 5: Dust entire cleared perimeter with chlorinated bleaching powder to prevent fly/mosquito breeding.",
        "Step 6: Mount CCTV warning signage and upload timestamped completion photo to Civic Sense portal.",
      ],
      penalNotice: "Statutory Warning under Solid Waste Management Rules 2016: Ongoing untreated waste piles violate National Green Tribunal orders and are subject to immediate departmental environmental audit.",
    };
  }

  // 4. STREETLIGHTS & ELECTRICAL HAZARDS
  if (normCategory === "streetlights" || normIssue.includes("light") || normIssue.includes("electric") || normIssue.includes("wire") || normIssue.includes("power")) {
    return {
      formCode: "FORM E-07 / DISCOM-POW",
      formTitle: "STATUTORY HIGH-RISK ELECTRICAL HAZARD & PUBLIC ILLUMINATION RESTORATION ORDER",
      departmentName: "Electrical Engineering Division & State Power Distribution Corporation (DISCOM)",
      targetOfficerDesignation: "Divisional Electrical Engineer (DEE), Operations & Streetlighting",
      defaultOfficerName: "Er. Sandeep Patel, B.Tech (Electrical Eng.)",
      targetOfficerEmail: "dee.electrical.zone4@municipalcorp.gov.in",
      targetOfficerPhone: "+91 94483 45678",
      statutoryAct: "Central Electricity Authority (Measures relating to Safety and Electric Supply) Regulations & Indian Electricity Act 2003",
      regulatoryCode: "CEA Safety Code Sec 68 / Bureau of Indian Standards IS:10322 (Public Lighting Luminaires)",
      sopReference: "DISCOM Standard Line Hazard Isolation & Aerial Maintenance SOP # ELEC-99",
      hazardClassification: severity === "critical" || severity === "high"
        ? "Class-1 Extreme Public Safety Hazard: Live Phase Shock & Electrocution Risk"
        : "Class-2 Public Illumination Blackout & Urban Crime Vulnerability",
      defaultSlaHours: severity === "critical" ? 6 : severity === "high" ? 12 : 24,
      diagnosticMetrics: [
        { label: "Voltage Potential Class", value: "230V Single-Phase / 415V Three-Phase AC Distribution Circuit" },
        { label: "Electrocution Hazard Radius", value: "Exposed conductor at pedestrian reach height (0.5m - 2.0m from grade)" },
        { label: "Luminance Deprivation Index", value: "Critical dark corridor (>180m stretch with ground illuminance < 1.5 Lux)" },
        { label: "Earthing Integrity", value: "Compromised ground electrode resistance (>25 Ohms measured)" },
      ],
      machineryChecklist: [
        "1x Hydraulic Sky-Lift (Articulated Boom Bucket Truck) with 12m Vertical Reach",
        "1x Digital High-Voltage Insulation Resistance Megger Tester (1000V)",
        "1x Underground Cable Fault Distance Locator",
        "1x Calibrated Digital Lux Meter for Street Surface Illuminance Verification",
      ],
      materialsChecklist: [
        "1x 90W IP66 High-Lumen Surge-Protected LED Streetlight Luminaire (BIS Certified)",
        "20m 4-Core 16 sq.mm XLPE Armoured Underground Copper/Aluminium Conductor Cable",
        "1x Waterproof Pole-Base MCB Distribution Box with 16A C-Curve Breaker",
        "1x 2.5m Copper-Bonded Chemical Earth Electrode with Bentonite Backfill Compound",
      ],
      crewRequirement: [
        "1x Certified Line Inspector (Grade-A Electrical Contractor License)",
        "2x Senior Linemen equipped with 15kV Certified Dielectric Gloves & Arc-Shields",
        "1x Aerial Sky-Lift Hydraulic Operator",
      ],
      scheduleOfRates: [
        { code: "ELE-SSR-05", item: "Emergency circuit isolation, feeder testing & cable insulation Megger audit", quantity: "1 Circuit", unitRate: "₹2,600 / test", totalAmount: "₹2,600" },
        { code: "ELE-SSR-14", item: "Hydraulic sky-lift deployment & high-elevation luminaire arm service", quantity: "1 Pole", unitRate: "₹4,200 / pole", totalAmount: "₹4,200" },
        { code: "ELE-SSR-22", item: "Laying, trenching & end-termination of 4-core 16 sq.mm armoured cable", quantity: "20 Meters", unitRate: "₹290 / meter", totalAmount: "₹5,800" },
        { code: "ELE-SSR-39", item: "Supply & installation of 90W IP66 LED Luminaire fixture with 10kV surge protection", quantity: "1 Set", unitRate: "₹4,800 / fixture", totalAmount: "₹4,800" },
        { code: "ELE-SSR-44", item: "Chemical earth electrode installation & ground resistance certification (<2 Ohms)", quantity: "1 Set", unitRate: "₹2,400 / set", totalAmount: "₹2,400" },
      ],
      totalEstimatedCost: "₹19,800 (Nineteen Thousand Eight Hundred Rupees)",
      actionProtocol: [
        "Step 1: Instantly de-energize pole feeder circuit from local roadside distribution pillar kiosk.",
        "Step 2: Verify zero residual electrical charge using calibrated high-voltage proximity detector.",
        "Step 3: Disconnect exposed/damaged cabling and splice new XLPE armoured cable inside pole junction box.",
        "Step 4: Mount BIS certified LED luminaire unit using hydraulic bucket truck and secure IP66 glands.",
        "Step 5: Drive chemical earth rod and verify earth resistance measures under 2 Ohms.",
        "Step 6: Energize circuit, record minimum 25 Lux street illuminance, and submit visual resolution proof.",
      ],
      penalNotice: "Statutory Mandate under Section 161 of Indian Electricity Act 2003: Exposed live conductors with electrocution potential require immediate emergency isolation; negligence is criminally liable.",
    };
  }

  // 5. EMERGENCY & DISASTER RESPONSE
  if (normCategory === "emergency" || normIssue.includes("flood") || normIssue.includes("fire") || normIssue.includes("collapse") || normIssue.includes("tree")) {
    return {
      formCode: "FORM DMR-01 / NDMA-CIT",
      formTitle: "URGENT DISASTER MITIGATION & CIVIC HAZARD CONTAINMENT DIRECTIVE",
      departmentName: "Disaster Management Authority & Emergency Municipal Rapid Response Unit",
      targetOfficerDesignation: "District Disaster Management Officer & Chief Fire / Rescue Officer",
      defaultOfficerName: "Capt. Anand Varma, Retd. (Disaster Response)",
      targetOfficerEmail: "ddma.emergency@municipalcorp.gov.in",
      targetOfficerPhone: "+91 94484 56789",
      statutoryAct: "Sections 30, 34 & 51 of The Disaster Management Act 2005",
      regulatoryCode: "National Disaster Management Authority (NDMA) Urban Flood & Incident Command Guidelines",
      sopReference: "SOP-DISASTER-RAPID-01 (Incident Command System)",
      hazardClassification: "Class-A Severe Urban Impasse: Imminent Threat to Life, Property & Thoroughfare",
      defaultSlaHours: 4,
      diagnosticMetrics: [
        { label: "Emergency Class", value: "Urban Crisis Hazard / Severe Structural or Flood Impediment" },
        { label: "Population Impacted", value: "Immediate danger to surrounding neighborhood and vehicular transit" },
        { label: "Secondary Risk", value: "Compounded electrical short-circuit & drainage back-surge danger" },
      ],
      machineryChecklist: [
        "1x Heavy 30-Ton Hydraulic Recovery Crane & Flatbed Transporter",
        "2x High-Output Submersible Dewatering Engines (120 HP)",
        "2x Heavy-Duty Motorized Chain-Saws & Hydraulic Jaws-of-Life Cutters",
        "1x Emergency Incident Command Mobile Control Van",
      ],
      materialsChecklist: [
        "Emergency Flood Barriers & 200 Heavy Sandbags",
        "High-Intensity Battery-Powered Night Floodlights",
        "High-Visibility Safety Cordon Netting & Warning Reflectors",
      ],
      crewRequirement: [
        "1x Incident Commander (Executive Magistrate / DDMA)",
        "1x Station Fire Officer & 4 Firefighters",
        "6x Municipal Rapid Emergency Action Task Force Members",
      ],
      scheduleOfRates: [
        { code: "DMR-SSR-01", item: "Emergency heavy crane mobilization & site clearance operations", quantity: "1 Operation", unitRate: "₹18,000 / op", totalAmount: "₹18,000" },
        { code: "DMR-SSR-04", item: "High-capacity diesel flood dewatering & debris pump extraction", quantity: "4 Hours", unitRate: "₹2,500 / hr", totalAmount: "₹10,000" },
        { code: "DMR-SSR-11", item: "Emergency structural stabilization / tree removal & disposal", quantity: "1 Site", unitRate: "₹8,500 / site", totalAmount: "₹8,500" },
        { code: "DMR-SSR-99", item: "Perimeter cordon, evacuation marshaling & public safety signage", quantity: "1 Setup", unitRate: "₹5,000 / setup", totalAmount: "₹5,000" },
      ],
      totalEstimatedCost: "₹41,500 (Forty-One Thousand Five Hundred Rupees)",
      actionProtocol: [
        "Step 1: Establish 50-meter perimeter cordon and safely divert pedestrian and vehicle flow.",
        "Step 2: Deploy rapid dewatering / clearance equipment under incident commander supervision.",
        "Step 3: Remove physical obstructions and eliminate secondary hazards (electrical / structural).",
        "Step 4: Certify site safe for public traffic and upload resolution report to Civic Sense.",
      ],
      penalNotice: "Statutory Order under Section 51 of Disaster Management Act 2005: Non-compliance with emergency disaster mitigation orders constitutes a non-bailable statutory offense.",
    };
  }

  // 6. ACCESSIBILITY & PEDESTRIAN INFRASTRUCTURE
  if (normCategory === "accessibility" || normIssue.includes("footpath") || normIssue.includes("ramp") || normIssue.includes("pedestrian")) {
    return {
      formCode: "FORM ACC-05 / TCP-PWD",
      formTitle: "STATUTORY RIGHT-OF-WAY ENFORCEMENT & PEDESTRIAN ACCESSIBILITY REQUISITION",
      departmentName: "Urban Accessibility Wing & Town Planning Directorate",
      targetOfficerDesignation: "Executive Engineer (Pedestrian Infrastructure) & Town Planning Enforcement",
      defaultOfficerName: "Er. Sunita Rao, M.Plan (Urban Transport)",
      targetOfficerEmail: "ee.accessibility@municipalcorp.gov.in",
      targetOfficerPhone: "+91 94485 67890",
      statutoryAct: "Rights of Persons with Disabilities Act 2016 (Sections 40 & 44) & Municipal Pedestrian Byelaws",
      regulatoryCode: "IRC:103-2012 Guidelines for Pedestrian Facilities & Harmonized Guidelines on Barrier-Free Built Environment",
      sopReference: "SOP-PEDESTRIAN-ACCESS-03 (Universal Accessibility Protocol)",
      hazardClassification: "Class-B Pedestrian Right-of-Way Obstruction & Mobility Impairment",
      defaultSlaHours: 48,
      diagnosticMetrics: [
        { label: "Obstruction Classification", value: "Illegal Encroachment / Damaged Tactile Footpath Surface" },
        { label: "Pedestrian Volume", value: "High-density pedestrian corridor with senior citizen & school child transit" },
        { label: "Accessibility Status", value: "Zero wheelchair traversal possible; forces pedestrians into vehicular carriageway" },
      ],
      machineryChecklist: [
        "1x Mini Hydraulic Concrete Breaker & Kerb Cutter",
        "1x Heavy Municipal Towing Flatbed for Encroachment Clearance",
        "1x Pavement Paver Tile Compactor",
      ],
      materialsChecklist: [
        "Cast In-situ Concrete Tactile Warning & Directional Guiding Paver Tiles (300mm x 300mm)",
        "Pre-cast Concrete Kerb Stones & Galvanized Bollards",
        "Rapid Hardening High-Strength Non-Shrink Repair Mortar",
      ],
      crewRequirement: [
        "1x Assistant Town Planner (Enforcement)",
        "1x Municipal Police Marshal",
        "4x Skilled Pavement Construction Workers",
      ],
      scheduleOfRates: [
        { code: "ACC-SSR-02", item: "Encroachment removal and unauthorized obstacle clearance", quantity: "1 Clearance", unitRate: "₹4,500 / op", totalAmount: "₹4,500" },
        { code: "ACC-SSR-08", item: "Reconstruction of barrier-free gradient concrete ramp (1:12 slope)", quantity: "1 Ramp", unitRate: "₹9,800 / ramp", totalAmount: "₹9,800" },
        { code: "ACC-SSR-15", item: "Laying of tactile paving tiles for visually impaired navigation", quantity: "12 sq.m", unitRate: "₹750 / sq.m", totalAmount: "₹9,000" },
      ],
      totalEstimatedCost: "₹23,300 (Twenty-Three Thousand Three Hundred Rupees)",
      actionProtocol: [
        "Step 1: Issue statutory eviction notice and clear unauthorized encroachments on public right-of-way.",
        "Step 2: Reconstruct damaged pavement with standardized 1:12 gradient accessibility ramp.",
        "Step 3: Lay yellow tactile guiding paver tiles to guarantee barrier-free accessibility.",
        "Step 4: Submit geotagged before/after photo documentation to Civic Sense portal.",
      ],
      penalNotice: "Statutory Directive under Rights of Persons with Disabilities Act 2016: Non-compliance with accessibility standards exposes authorities to legal action before State Commissioner for Persons with Disabilities.",
    };
  }

  // 7. DEFAULT / CIVIC INTELLIGENCE / PUBLIC TRANSPORT
  return {
    formCode: "FORM G-01 / CMC-ADM",
    formTitle: "MUNICIPAL INTER-DEPARTMENTAL WORK ORDER & CIVIL REQUISITION",
    departmentName: "Municipal Corporation Administration & Public Grievance Directorate",
    targetOfficerDesignation: "Zonal Executive Officer / Assistant Municipal Commissioner",
    defaultOfficerName: "Er. N. K. Sharma, IAS (Zonal Commissioner)",
    targetOfficerEmail: "zonal.commissioner@municipalcorp.gov.in",
    targetOfficerPhone: "+91 94486 78901",
    statutoryAct: "Municipal Corporation Act & Citizen Public Service Guarantee Charter",
    regulatoryCode: "Municipal Engineering & Public Works Standards Code",
    sopReference: "SOP-CIVIC-GRIEVANCE-STD-01",
    hazardClassification: "Class-B Civic Infrastructure Defect & Public Convenience Issue",
    defaultSlaHours: 48,
    diagnosticMetrics: [
      { label: "Infrastructure Class", value: `${category.toUpperCase()} - ${issueType}` },
      { label: "Grievance Assessment", value: "Verified citizen issue requiring inter-departmental site inspection" },
      { label: "Public Convenience Impact", value: "Affects local neighborhood civic amenities and quality of life" },
    ],
    machineryChecklist: [
      "1x Departmental Maintenance Utility Truck",
      "Standard Civil Engineering Inspection Tool Kit",
      "Site Barricading & Safety Cones",
    ],
    materialsChecklist: [
      "Departmental repair materials as per site engineer requirement",
      "Standard municipal signage and caution notices",
    ],
    crewRequirement: [
      "1x Section Officer / Junior Engineer",
      "3x Departmental Field Workers",
    ],
    scheduleOfRates: [
      { code: "GEN-SSR-01", item: "Emergency site inspection and engineering assessment", quantity: "1 Inspection", unitRate: "₹2,500 / site", totalAmount: "₹2,500" },
      { code: "GEN-SSR-05", item: "Remedial civil maintenance and surface restoration", quantity: "1 Job", unitRate: "₹12,000 / job", totalAmount: "₹12,000" },
      { code: "GEN-SSR-09", item: "Site cleanup, photographic audit & public safety verification", quantity: "1 Audit", unitRate: "₹2,000 / audit", totalAmount: "₹2,000" },
    ],
    totalEstimatedCost: "₹16,500 (Sixteen Thousand Five Hundred Rupees)",
    actionProtocol: [
      "Step 1: Conduct on-site technical inspection within 12 hours of dispatch.",
      "Step 2: Mobilize designated departmental maintenance gang to execute repair.",
      "Step 3: Certify works completion in coordination with ward resident representatives.",
      "Step 4: Transmit photographic evidence to Civic Sense portal for public tracking update.",
    ],
    penalNotice: "Statutory Mandate: All public grievances registered via Civic Sense platform are subject to monthly audit by the Municipal Grievance Redressal Committee.",
  };
}

/**
 * Builds the complete Government Report Data structure with all computed fields
 */
export function buildGovernmentReportData(
  complaint: Complaint,
  overrides?: {
    customOfficerName?: string;
    customDepartmentName?: string;
    customSlaHours?: number;
    customNotes?: string;
    wardNumber?: string;
    zoneName?: string;
  }
): GovernmentReportData {
  const template = getDomainReportTemplate(complaint.category, complaint.issue_type, complaint.severity);

  const createdAt = new Date(complaint.created_at || Date.now());
  const now = new Date();
  
  const deptCode = template.formCode.split("/")[1]?.split("-")[0]?.trim() || "MUN";
  const memoNumber = `MEMO/MC/${deptCode}/${now.getFullYear()}/${complaint.application_id}`;

  const slaHours = overrides?.customSlaHours || template.defaultSlaHours;
  const deadlineDate = new Date(now.getTime() + slaHours * 60 * 60 * 1000);

  const lat = complaint.latitude || 12.9716;
  const lng = complaint.longitude || 77.5946;
  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  const qrVerificationCode = `CIVIC-SENSE-SECURE-${complaint.application_id}-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    memoNumber,
    dispatchDate: now.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    dispatchTime: now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    qrVerificationCode,
    complaint,
    template,
    wardNumber: overrides?.wardNumber || "Ward 84 (Central Tech Corridor)",
    zoneName: overrides?.zoneName || "Zone-IV (East Municipal Division)",
    customOfficerName: overrides?.customOfficerName || complaint.assigned_officer || template.defaultOfficerName,
    customDepartmentName: overrides?.customDepartmentName || complaint.assigned_department || template.departmentName,
    customSlaHours: slaHours,
    customNotes: overrides?.customNotes,
    slaDeadlineDate: deadlineDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    mapsUrl,
  };
}

/**
 * Formats a clean, high-priority WhatsApp / SMS Officer Dispatch message
 */
export function formatOfficerWhatsAppDispatch(data: GovernmentReportData): string {
  const { complaint, template, memoNumber, mapsUrl, slaDeadlineDate, customOfficerName, customDepartmentName } = data;
  
  return `🚨 *OFFICIAL GOVERNMENT REQUISITION - CIVIC SENSE* 🚨
🏛️ *Department:* ${customDepartmentName || template.departmentName}
📄 *Memo No:* ${memoNumber}
📅 *Date & Time:* ${data.dispatchDate} at ${data.dispatchTime}

👤 *To Officer:* ${customOfficerName || template.defaultOfficerName} (${template.targetOfficerDesignation})
⚡ *Urgency Level:* ${complaint.severity.toUpperCase()} (${template.hazardClassification})

📍 *INCIDENT LOCATION:*
• *Address:* ${complaint.address}
• *GPS Coordinates:* ${complaint.latitude?.toFixed(4) || "12.9716"}, ${complaint.longitude?.toFixed(4) || "77.5946"}
• 🗺️ *One-Tap GPS Navigation:* ${mapsUrl}

📋 *PROBLEM STATEMENT:*
"${complaint.description_normalized || complaint.description_original}"
${complaint.language && complaint.language !== "en" ? `(Reported by citizen in ${complaint.language.toUpperCase()}, AI Translated to English)` : ""}

🔍 *AI FORENSIC VERIFICATION:*
• Authenticity: ${complaint.photo_authenticity?.label || "Verified Real Field Evidence (96%)"}
• Admissibility: Certified Authentic Digital Telemetry under Sec 65B Evidence Act

🛠️ *REQUIRED FIELD MACHINERY & GANG:*
${template.machineryChecklist.map((m) => `• ${m}`).join("\n")}

⏱️ *STATUTORY SLA RESOLUTION DEADLINE:*
⏰ *Strictly by: ${slaDeadlineDate}*
⚖️ *Statutory Authority:* ${template.statutoryAct}

${data.customNotes ? `📝 *Admin Directive:* ${data.customNotes}\n` : ""}
🔗 *Full Dossier & Portal Link:*
http://localhost:3000/admin/complaints/${complaint.application_id}

_Issued by: Municipal Command & Grievance Redressal Cell_`;
}
