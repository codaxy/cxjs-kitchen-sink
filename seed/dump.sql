--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: ledger; Type: TABLE; Schema: public; Owner: cxjs; Tablespace: 
--

CREATE TABLE ledger (
    id uuid NOT NULL,
    name text,
    year integer NOT NULL,
    description text
);


ALTER TABLE public.ledger OWNER TO cxjs;

--
-- Name: ledger_account; Type: TABLE; Schema: public; Owner: cxjs; Tablespace: 
--

CREATE TABLE ledger_account (
    id uuid NOT NULL,
    ledger_id uuid,
    code character varying(10) NOT NULL,
    description text NOT NULL,
    by_party boolean NOT NULL,
    entries_allowed boolean NOT NULL
);


ALTER TABLE public.ledger_account OWNER TO cxjs;

--
-- Name: ledger_entry; Type: TABLE; Schema: public; Owner: cxjs; Tablespace: 
--

CREATE TABLE ledger_entry (
    id uuid NOT NULL,
    ledger_page_id uuid NOT NULL,
    index integer,
    ledger_account_id uuid NOT NULL,
    description text,
    party_id uuid,
    debit numeric,
    credit numeric,
    date date NOT NULL
);


ALTER TABLE public.ledger_entry OWNER TO cxjs;

--
-- Name: ledger_page; Type: TABLE; Schema: public; Owner: cxjs; Tablespace: 
--

CREATE TABLE ledger_page (
    id uuid NOT NULL,
    ledger_id uuid NOT NULL,
    number integer NOT NULL,
    description text NOT NULL,
    date date NOT NULL
);


ALTER TABLE public.ledger_page OWNER TO cxjs;

--
-- Name: party; Type: TABLE; Schema: public; Owner: cxjs; Tablespace: 
--

CREATE TABLE party (
    id uuid NOT NULL,
    name text NOT NULL,
    date date NOT NULL,
    address1 text,
    address2 text,
    city text,
    postal_code text,
    country_code text,
    tax_number text,
    email text,
    website text,
    phone text
);


ALTER TABLE public.party OWNER TO cxjs;

--
-- Name: role; Type: TABLE; Schema: public; Owner: cxjs; Tablespace: 
--

CREATE TABLE role (
    id uuid NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    permissions text[]
);


ALTER TABLE public.role OWNER TO cxjs;

--
-- Name: user; Type: TABLE; Schema: public; Owner: cxjs; Tablespace: 
--

CREATE TABLE "user" (
    id uuid NOT NULL,
    email character varying(50) NOT NULL,
    display_name character varying(50),
    created_time timestamp without time zone NOT NULL,
    last_login_time timestamp without time zone,
    password_hash text
);


ALTER TABLE public."user" OWNER TO cxjs;

--
-- Name: user_role; Type: TABLE; Schema: public; Owner: cxjs; Tablespace: 
--

CREATE TABLE user_role (
    user_id uuid NOT NULL,
    role_id uuid NOT NULL
);


ALTER TABLE public.user_role OWNER TO cxjs;

--
-- Data for Name: ledger; Type: TABLE DATA; Schema: public; Owner: cxjs
--

COPY ledger (id, name, year, description) FROM stdin;
afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	General Ledger	2020	A central repository for accounting data like accounts payable, accounts receivable, cash management, fixed assets, purchasing and projects. 
\.


--
-- Data for Name: ledger_account; Type: TABLE DATA; Schema: public; Owner: cxjs
--

COPY ledger_account (id, ledger_id, code, description, by_party, entries_allowed) FROM stdin;
feab85d9-c04c-46bb-8ee3-5bafd12c3908	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.4.6	Financial Assets Classified By Designation	f	t
3fb468ba-297a-4b9d-8719-be342ff8f0f3	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.5	Biological Assets	f	f
9ecdf082-196d-4d37-a725-b44cb828ef52	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.5.1	Biological Assets At Cost	f	t
acb3c019-2525-493d-88c0-f049d18e1fd7	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.5.2	Biological Assets At Fair Value	f	t
e7d9364c-83c9-4062-8b77-02f7ac592dd0	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.6	Accrued And Other Assets	f	f
d62004bf-3227-4bf7-b71f-39dec9b5ffde	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.6.1	Prepayments And Other Current Assets	f	t
e3e71db7-e830-4f3c-82df-d36c0a5a438b	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.6.2	Tax Related Receivables	f	t
7603bc71-4a50-4f0d-9ae9-085955c645bc	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.6.3	Service Providers	f	t
f4766594-1d9a-4b18-bf9b-0e8c6d99c425	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.6.4	Construction Contract Asset	f	t
280004c4-579c-4c90-b801-d91fc5fac319	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.6.5	Set Up Costs	f	t
b52bc3f7-861a-4b0e-ab1d-866f12638de8	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.6.6	Restricted Assets	f	t
7d9ca59e-3812-4d40-bf70-3119a0c3f1bd	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.6.7	Current Investments Not Classified As Cash Equivalents	f	t
66112340-fd10-4d57-9481-73ba7e192e91	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.6.8	Additional, Other And Miscellaneous Assets	f	t
2907605e-81c0-4fa1-a165-6755c23cfb9d	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.7	Inventories	f	f
b9939eb0-af62-4624-94a7-fd506241a566	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.7.1	Raw Materials and Production Supplies	f	t
3ce7dd60-56c9-4f16-8171-8ff463e51c44	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.7.2	Merchandise	f	t
4f342e9d-aa97-40df-b6bb-cfb3a575f40b	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.7.3	Food and Beverage	f	t
e66514e9-e7ea-4744-9f4d-9a41aff8fb15	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.7.4	Agricultural Produce	f	t
616c4a60-e1ec-4dba-b355-85c3b744f18e	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.7.5	Work In Progress	f	t
b5889778-752b-432b-8b6f-b2089c2ba7e7	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.7.6	Materials and Supplies To Be Consumed In Production Process Or Rendering Services	f	t
1034bbd1-8d73-4cb3-b3ee-294a3ef9eba6	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.7.7	Finished Goods	f	t
c5d8dd25-ae15-4fb8-8b60-0db73d72b781	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.7.8	Packaging And Storage Materials	f	t
8b063be7-0de1-43db-a35b-e8b6e8d13004	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.7.9	Spare Parts	f	t
a6604e7a-428d-4c61-be85-b17c4433b614	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.7.10	Fuel	f	t
0027f6f2-dec5-4716-8d1c-8e01e0d1bdf8	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.7.11	Property Intended For Sale In Ordinary Course Of Business	f	t
0459743f-24bf-48f4-90c0-6059f37ce8a0	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.7.12	Inventories In Transit	f	t
3e350cac-424e-40cb-9025-ec084f205a8a	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.7.13	Other Inventories	f	t
f57c0996-c3fe-49be-879a-9ef9bab7362c	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.7.14	Inventories Pledged As Security For Liabilities	f	t
561c3e4e-a59d-4e62-8535-3ec09bfd6524	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.7.15	Inventories At Fair Value Less Costs To Sell	f	t
b4f454e5-7936-4749-96ab-df2986a32f5d	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.7.16	Acquisition In Progress	f	t
005bb153-1b58-4970-b3bd-80375c1d6f53	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.7.17	Additional Inventory Items	f	t
73879499-7373-4cef-9958-ae49cd15e216	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.8	Receivables	f	f
8f4f451d-75f7-48f6-a36d-6240de2ef2f7	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.8.1	Trade Receivables	f	t
9bfee71a-dfbb-4a63-8f06-132a49bb99ec	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.8.2	Contract Assets	f	t
d27f1278-7a71-4aa2-83b5-cb2fa0b09ec4	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.8.3	Other Receivables	f	t
6917bae1-20cf-4b58-9687-082552a137c1	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.8.4	Adjustments	f	t
082204bb-2331-4f05-bccc-0868493eee7f	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.9	Cash And Cash Equivalents	f	f
957d236a-6c9d-48a4-a858-cf0357b9d88e	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.9.1	Cash	f	t
b62b0cf1-f89f-4453-96ad-e8fc037b5878	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.9.2	Cash Equivalents	f	t
b3e9c2e3-2464-430e-b01f-9f917b437842	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.9.3	Short-Term Investments	f	t
a6ffb1d8-293f-430e-ae5b-3f269cbcd7a2	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.9.4	Other Cash And Cash Equivalents	f	t
e11c49dc-a9c0-4bbb-b4a3-a78d65272997	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2	Equity	f	f
d6122d3f-4c12-4446-89cb-8ccd4e572d9c	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.1	Issued Capital	f	f
fcb93aba-af4e-4508-99bd-1ef47588528f	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.1.1	Ordinary Shares	f	t
9438f9a6-6d8b-4271-b5ff-1731c2beb794	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.1.2	Preferred Shares	f	t
d101aa12-c6df-47bf-a436-9daa992ede1f	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.1.3	Par Value Per Share	f	t
135bbda2-e5ef-4cb7-b9dd-e449e852dcf3	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.1.4	Share Premium	f	t
ade44082-d0f8-41c3-9c64-f95f495c7767	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.1.5	Additional Paid In Capital	f	t
50373191-a0af-4a87-aac1-66afa7a21d7c	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.2	Retained Earnings	f	f
7abb4536-70de-4ce5-b901-cc535b23074a	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.2.1	Current Year's Retained Profit (Loss)	f	t
96639588-f52e-43b1-99a8-94b907036a84	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.2.2	Prior Years' Retained Profit (Loss)	f	t
cd21d34f-6c5a-4be9-a48c-cf4ca44e1181	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.3	Other Reserves (Accumulated Other Comprehensive Income)	f	f
d48380e2-1d47-4f87-a51f-fe2d1a40983f	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.3.1	Revaluation Surplus	f	t
887e989d-78a9-44af-b025-b8c4694eb2a6	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.3.2	Reserve Of Exchange Differences On Translation	f	t
b2f40dc5-8ff7-45b3-bb73-e55e08fa0efd	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.3.3	Reserve Of Cash Flow Hedges	f	t
ad2b9528-2217-4eb4-82fa-75388c7aaba0	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.3.4	Reserve Of Gains And Losses On Hedging Instruments That Hedge Investments In Equity Instruments	f	t
dfa0dbe2-b2f1-402e-b7ec-e972b487d75d	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.3.5	Reserve Of Change In Value Of Time Value Of Options	f	t
6a1f6dca-7adc-4e38-b1f5-04b967cef32e	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.3.6	Reserve Of Change In Value Of Forward Elements Of Forward Contracts	f	t
835303b4-cc64-46f7-9d9a-1774cab36d7b	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.3.7	Reserve Of Change In Value Of Foreign Currency Basis Spreads	f	t
6a679b07-66c2-4e1c-9040-03f2e326e541	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.3.8	Reserve Of Gains And Losses On Financial Assets Measured At Fair Value Through Other Comprehensive Income	f	t
c797d2c1-a4c0-4743-80fb-ffdc162c2e86	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.3.9	Reserve Of Gains And Losses On Remeasuring Available-For-Sale Financial Assets	f	t
7ca109cf-25cc-4ec4-ba4d-ad9ef3aa9e35	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.3.10	Reserve Of Share-Based Payments	f	t
c84730b5-1fd3-4074-b0e0-1bebd1dae748	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.3.11	Reserve Of Remeasurements Of Defined Benefit Plans	f	t
dbcb03d2-39f3-4a20-a690-709a962096db	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.3.12	Amount Recognised In Other Comprehensive Income And Accumulated In Equity Relating To Non-Current Assets Or Disposal Groups Held For Sale	f	t
cce1f6d6-d987-4702-b0d2-62c663c4e072	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.3.13	Reserve Of Gains And Losses From Investments In Equity Instruments	f	t
968e2814-0365-463f-adda-80a94f14a031	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.3.14	Reserve Of Change In Fair Value Of Financial Liability Attributable To Change In Credit Risk Of Liability	f	t
5d6ce995-869f-43c9-b83a-3456a76a572c	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.3.15	Reserve For Catastrophe	f	t
2f53c9ae-d1c9-424e-ab78-2ee4d5a1952d	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.3.16	Reserve For Equalisation	f	t
7585bf25-f299-451d-a182-256530f50d36	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.3.17	Reserve Of Discretionary Participation Features	f	t
f50e480d-3ae9-4330-a7ed-77feb75b7441	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.3.18	Reserve Of Equity Component Of Convertible Instruments	f	t
4bfd0990-2940-4cfd-8393-65920cebf1f4	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.3.19	Capital Redemption Reserve	f	t
eecdf596-5b9b-488b-832c-7d369709911d	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.3.20	Merger Reserve	f	t
8a80db5a-c008-4042-bec0-dc7538492825	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.3.21	Statutory Reserve	f	t
6565e3be-a3ef-47ef-b428-64293b156428	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.4	Other Equity	f	f
1d20cec0-a970-4ec6-9b05-8c380aad3cbf	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.4.1	Other Equity Interest	f	t
ffc7349a-e7fd-42b2-9e36-22a26e28cd8b	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.4.2	Capital Reserve	f	t
a512f6bc-c4a4-4000-bd2c-d05052202103	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.4.3	Receivable For Shares (Share Subscribed But Unissued)	f	t
669b05e7-e551-4f4a-bacd-7d664d47d22e	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.4.4	Treasury Shares	f	t
821554d3-161d-4a3c-aa83-3053bdde5de6	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.4.5	Controlling Interest	f	t
fd88d1ff-5e51-46a6-bf0d-e557e1b881b0	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	2.4.6	Non-Controlling Interest	f	t
143eab7d-9eab-4dda-b7c1-1802193ea644	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3	Liabilities	f	f
fcfcca06-8cbd-4492-b6c2-6eebc68fdb85	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.1	Borrowings	f	f
f9e17914-4f80-405f-93b0-3ff766953932	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.1.1	Borrowings (By Type)	f	t
10fff419-c6ea-48f3-aa2b-f81850bc22ea	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.1.2	Financial Liabilities (By Designation)	f	t
8eb439be-658f-4286-8932-90ff6239cba6	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.2	Provisions	f	f
0a918e6d-0ea8-4419-a82a-5ccf2a81b55f	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.2.1	Employee Benefits	f	t
5356f598-eec5-4b21-9c96-c38306846ad0	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.2.2	Warranties	f	t
09675429-4d0d-4a5d-ba18-78fb6f45a402	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.2.3	Refunds	f	t
bb351ee7-df6b-4705-8f2a-f3b7efb1b61a	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.2.4	Decommissioning, Restoration And Rehabilitation	f	t
b2b1d373-aa34-4310-b26d-0aa622291de5	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.2.5	Restructuring	f	t
04065271-092b-41ee-823c-2595134b757d	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.2.6	Onerous Contracts	f	t
4f7f6879-77aa-4f3e-bbad-915f06cd914a	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.2.7	Legal Proceedings	f	t
75bf08db-ceef-427a-9574-da172465867e	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.2.8	Business Combinations	f	t
2e2db146-edea-4d6d-a551-c2d53cceb781	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.2.9	Liabilities Included In Disposal Groups	f	t
d4eac6e5-8b34-45b0-b463-53532ddcb09f	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.2.10	Other Provisions	f	t
ce91218a-9854-498a-b43a-983fa543d34a	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.2.11	Miscellaneous Other Provisions	f	t
7fab95a8-d03c-4827-a223-436125353ff1	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.3	Trade And Other Payables	f	f
90445a36-cd22-44e3-9668-bd54e5e5eb6a	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.3.1	Trade Payables	f	t
35c271c7-b0ab-498b-80c2-43b779fd1377	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.3.2	Contract Liabilities	f	t
a36bb6b8-a2a6-4269-9adf-37312beb8350	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.3.3	Related Party Payables	f	t
c79d0cca-1fb2-4ded-8f1a-c0a9da634b53	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.3.4	Retention Payables	f	t
2365baaa-c9bd-407a-bf80-bf980872d74a	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.3.5	Adjustments	f	t
399c2ca7-20e5-45c3-b067-928b106714b6	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.4	Accrued, Deferred And Other Liabilities	f	f
86389283-11db-4885-b573-05356eea05fb	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.4.1	Accrued Liabilities	f	t
25a578e5-9e4c-45f6-9eac-9905055edd73	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.4.2	Accrued Expenses And Other Liabilities	f	t
4b380eb5-cf6b-4f23-811b-218b8e4b374f	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.4.3	Dividend Payables	f	t
88cf5911-9aa9-4f97-b02a-f5b7f05edc0f	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.4.4	Interest Payable	f	t
d6b5da90-82fe-4fb8-bbe7-b8b7c2aa625b	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.4.5	Deferred Income, Unearned Revenue	f	t
1fa47a40-e4ba-4730-891a-137255be0fff	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.4.6	Advances	f	t
38fcf069-dbba-42ea-b6a6-681dee611b42	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.4.7	Construction Contract Liability	f	t
20e97725-d91b-4ae0-8281-63a8017d4480	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.4.8	Other Payables	f	t
a8bcb59e-8525-4d22-92dc-64d6a4f1fbc2	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.5	Tax Liabilities	f	f
ecf94764-df8d-41ee-8e50-9b34bbc8aad0	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.5.1	Current Tax Liabilities	f	t
47f2c427-6e15-4db6-9a70-6cfb7f9ff27a	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.5.2	Deferred Tax Liabilities	f	t
51cbac1d-0bd6-4a54-a58c-0eb8362ecf7e	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.6	Other And Miscellaneous Liabilities	f	f
bf20e539-596e-472d-9410-2079badc13df	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.6.1	Finance Leases	f	t
d2626baf-4b5f-4d32-bccb-028890c41500	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.6.2	Deposits	f	t
e525bb89-d53c-40ec-8d79-68972aacf78b	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.6.3	Derivative Financial Liabilities	f	t
c0c14d90-0ae9-4f9f-953a-f8170760cadd	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.6.4	Government Grant Obligations	f	t
b5108ec7-e156-4fde-b550-1278c3c923d7	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.6.5	Liabilities Due To Central Banks	f	t
8abf4987-acbd-409e-8d5c-2afa989c2066	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.6.6	Subordinated Liabilities	f	t
2e592dbb-8ae5-4398-9b4d-68c111f301cb	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	3.6.7	Other Liabilities	f	t
0d8f0b83-575a-4265-b2b9-d922e1227ec8	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	4	Revenue	f	f
15d19c44-92ec-4678-994b-4b9b8b2d0bb6	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	4.1	Goods	f	f
132ce246-8e1a-49d5-b927-eb08d1c758c3	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	4.1.1	Products	f	t
ed9ec98e-b72d-44f8-a4de-d1bd65ecaf73	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	4.1.2	Merchandise	f	t
7898a418-5ce0-4038-96b3-0fd76c352160	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	4.1.3	Adjustments	f	t
76b9d43e-00b2-4731-9c1c-5f00a7e9cef3	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	4.1.4	Specifically Itemized Goods Revenues	f	t
41541779-0acc-4895-8b78-ed00275329d2	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	4.2	Services	f	f
40cc3fbf-ff8c-4db2-a84c-62e9f5e15dc3	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	4.2.1	Specifically Itemized Service Revenues	f	t
12a69d7c-d8ee-4068-abd2-32f1e0184dcf	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	4.3	Revenue From Contracts With Customers	f	f
8638f9b6-b071-430f-8606-dd0453c5cd41	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	4.4	Revenue From Construction Contracts	f	f
c04fe8c5-60c0-4cce-a18e-80f27a7f9b95	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	4.5	Franchise Fee Income	f	f
0d1b8a0b-affa-4b58-a636-912fc7ba7784	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	4.6	Barter Sales	f	f
4b35f81b-cfdb-4ea1-aa4c-7e8791875012	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	4.6.1	Goods	f	t
118bed85-4d59-4680-9519-f587fa22ed5e	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	4.6.2	Services	f	t
47de077e-cb95-4eb0-ab31-3817f12401dd	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	4.6.3	Construction Contracts	f	t
c7f89b7c-5d72-4965-b151-299ba076dfb9	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	4.6.4	Royalties	f	t
4380a927-6234-44f6-ae33-7681f10088ba	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	4.6.5	Interest	f	t
fb959e3f-92ab-416b-83ea-c71b1daee58c	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	4.6.6	Dividends	f	t
b6250caf-61cc-4046-8674-4c4df0b19ead	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	4.6.7	Other Exchange Revenue	f	t
e350b543-eef4-427c-b4bc-81ba0bfe25fe	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	4.7	Dividends Classified As Operating Expense	f	f
a5883d90-a0f9-4a1d-8d1e-048ea5ce0c89	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	4.8	By Nature Non-Revenue Income	f	f
833154e6-ba3c-4629-9176-337657aa8502	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	4.8.1	Changes In Inventories	f	t
134983be-92a2-48a7-b388-da43ae452f87	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	4.8.2	Work Performed By Entity And Capitalised	f	t
7fc958fe-dafd-403d-9b0c-fce1a59ab264	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	5	Operating Expenses	f	f
12958486-9d0b-4216-bafb-767f84cdb959	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	5.1	Expenses Classified By Nature	f	f
76969467-0509-49ff-bb35-298aacf9e0a7	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	5.1.1	Raw Materials And Consumables	f	t
a477d45a-058e-4ecc-b120-2a28892ae43c	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	5.1.2	Merchandise	f	t
2ae7f819-9b54-438a-af00-7ee5c7222e86	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	5.1.3	Employee Benefits	f	t
8f0d6781-b5c2-4deb-84a5-48f52eb92d1a	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	5.1.4	Services	f	t
e0bdce00-836a-4a3a-adcb-fc4ffc95492d	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	5.1.5	Transportation Expense	f	t
57acf1f7-e8d6-46d8-8403-706adb7a790e	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	5.1.6	Depreciation And Amortisation	f	t
3176a696-d9ad-42dd-9438-075a911b2c0c	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	5.1.7	Rental Expense	f	t
e4375c7c-7f61-47fa-80d6-c8665c23cb69	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	5.1.8	Tax Other Than Income	f	t
1114cd2e-f5a1-4f70-bc47-42cae1bd41b6	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	5.2	Expenses Classified By Function	f	f
b82fdfb6-b6e2-4d70-b524-76c685f05a8e	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	5.2.1	Cost Of Sales	f	t
d13a093a-501d-4186-824b-64b8e2d2032c	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	5.2.2	Selling, General And Administrative	f	t
40e4076b-8c26-42e5-bb45-a7aebadcb6e3	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6	Non-Operating Income And Expense (Peripheral Activities)	f	f
68d5b78d-0d80-4750-82d2-c39ba8f7fe8b	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.1	Other Income	f	f
843d197a-93b8-4603-b586-9a4522ecfb29	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.1.1	Finance Income	f	t
225f38d2-2d02-43b4-9a87-0427063d151a	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.1.2	Interest Income	f	t
e9a2b733-8153-4570-89af-ce379ed578df	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.1.3	Dividends	f	t
8d7af375-d046-4b3f-a84e-fd39cb69e988	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.1.4	Royalties	f	t
3bb5a218-6bbf-45ca-bf1a-702d990218d6	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.1.5	Licensees	f	t
aee1b124-0a13-4f82-a58b-720c3b567a79	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.3.16	Gain (Loss) On Financial Assets Reclassified To Fair Value	f	t
bab1870a-5d30-4eed-889f-673495b2c99c	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.3.18	Gain (Loss) On Derecognition Of Amortised Cost Assets	f	t
69eb1777-95cc-46b6-ae34-8ca33ad1a176	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.3.19	Gain (Loss) On Non-Cash Dividends	f	t
49f8de93-bf7a-477a-9475-1f61247e842a	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.4	Other Comprehensive Income Reclassification Adjustments	f	f
3428cc13-e449-4600-a988-f1be85b51472	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.4.1	Exchange Differences On Translation	f	t
298078c1-e407-4009-898f-41387cf741ec	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.4.2	Available-For-Sale Financial Assets	f	t
f499dc08-6ddd-4dcd-9942-07d7d9800e22	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.4.3	Cash Flow Hedges	f	t
e77619ff-25d1-41b1-b3f1-a8f0ef0bbafb	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.4.4	Hedges Of Net Investment In Foreign Operations	f	t
dce049c3-668c-4328-adc8-0421b488032c	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.4.5	Change In Value Of Time Value Of Options	f	t
ba97ffd4-131f-4459-80cd-04a8b72a3002	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.4.6	Change In Value Of Forward Elements Of Forward Contracts	f	t
30815dc4-34b0-481f-8f99-e109e82da229	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.4.7	Change In Value Of Foreign Currency Basis Spreads	f	t
82c91abb-39c8-4a39-bf0a-1cfe921abffe	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.4.8	Financial Assets Measured At Fair Value Through Other Comprehensive Income	f	t
2402bbb0-cab7-4d1d-9dac-152a497fb32c	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.5	Group Companies	f	f
01bbdd1d-7e02-4559-a565-223690d4146a	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.5.1	Equity Method Investments	f	t
c3cc0518-26c0-411f-96b5-d82e2cf0824f	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.5.2	Subsidiaries, Jointly Controlled Entities And Associates	f	t
5c234f9f-e2f7-4662-94ba-c515c43297eb	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1	Assets	f	f
45efdb0c-6d70-4b4c-a5ff-0099c813d7b2	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.1	Property, Plant And Equipment	f	f
beb11e77-fe2d-426c-b142-ec206fb2d9a4	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.1.1	Land And Buildings	f	t
e28072ee-7c8e-47f7-b026-a981168b06ac	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.1.2	Machinery And Equipment	f	t
2d694f1c-0428-42ff-8054-1fbf46556efb	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.1.3	Vehicles	f	t
e3a2e890-715a-4ff7-ae12-99c79aa5fd1d	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.1.4	Fixtures And Fittings	f	t
30e00b5c-8dda-46d5-bb75-abc9710612a8	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.1.5	Exploration And Evaluation Assets	f	t
97d8abf4-7e45-485d-8c5f-d4abe5d1e996	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.1.6	Additional Property, Plant And Equipment	f	t
7994c08a-18fe-4224-91db-f0f31c34d379	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.1.7	Construction In Progress	f	t
29530e76-2346-40b1-8352-64fee54dcfd5	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.2	Investment Property	f	f
4cb6e743-2d0e-4ce5-8ddd-a30dd07094e7	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.2.1	Investment Property Under Construction Or Development	f	t
8c659667-7817-4f13-9889-56768685b9f5	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.2.2	Investment Property Completed	f	t
20b4f0ff-ea0b-4cf6-809d-6ec6df14cc30	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.3	Intangible Assets	f	f
c44c72f7-7c66-4a60-9f8b-d036cd5b1aec	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.3.1	Intangible Assets Other Than Goodwill	f	t
bcfeac03-0859-4c6a-a184-ec6fe1695435	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.3.2	Goodwill	f	t
692acb8f-0c1a-41a4-9258-39c37ffc82c7	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.4	Financial Assets	f	f
c75c0c40-bbe6-4bc8-a574-2ba463244e15	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.4.1	Group Companies (Intercompany Investments)	f	t
c524d22e-1cc6-4837-9c7b-3d25e386038d	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.4.2	Investments And Financial Instruments	f	t
abf83eb0-d9b6-4236-b981-6ea355871c86	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.4.3	Derivative Financial Assets	f	t
3cfe94a4-0130-44a6-ad85-a66ca6f697fc	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.4.4	Other Financial Assets	f	t
7556b53e-3a50-4d59-8c30-3cbe5a3c4916	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	1.4.5	Allowance For Credit Losses (Aggregate)	f	t
98b5972f-ee7b-4ea7-8604-0d48050b6093	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.1.6	Rental Income	f	t
fed380d3-07a9-4752-afa8-c892c1fd35f8	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.1.7	Contractual Fines And Penalties	f	t
53be1e17-ce26-476a-b189-dd03c1708681	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.1.8	Income From Government Grants	f	t
b63ede46-7526-4054-82f1-63ba879c8f9c	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.1.9	Property Service Charge Income	f	t
30d434f7-f01a-4342-a7d7-e0664977aa4f	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.1.10	Income From Reimbursements Under Insurance Policies	f	t
ead54e63-a83b-47d6-b040-c5da04628a63	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.1.11	Other Revenue	f	t
e0a4b0a8-9513-4140-add9-0e771ca34340	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.2	Other Expenses	f	f
bea07845-bc4a-419b-b4bf-b4e93c6c025e	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.2.1	Finance Costs	f	t
b979aeea-8734-46fe-a249-9265e90be5b8	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.2.2	Interest Expense	f	t
16cbffbe-1ccf-4263-81bb-f3af17e91da8	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.2.3	Property Service Charges	f	t
c4a46d6a-2bc8-43a6-a614-81b23befdc72	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.2.4	Unwinding Discounts On Provisions	f	t
cc72f0eb-07ea-4cd7-95f2-0dad3d6b6d00	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.2.5	Donations And Subsidies	f	t
fb0f4256-7827-4672-b458-9580b8b5f07d	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.2.6	Dividends Classified As Expense	f	t
0972d015-0888-4f6f-9148-7e8557824ee8	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.2.7	Other Expense By Nature	f	t
f2adb8c4-7df6-4023-9a18-6a612e2e135a	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.2.8	Other Operating Expenses By Function	f	t
26d80867-1d51-442e-b12e-15bcc1319619	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.3	Gains And Losses	f	f
ed313d86-bd38-44b5-80e3-59e7b0d56bb5	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.3.1	Foreign Exchange Gain (Loss)	f	t
0a47b43d-8d7a-4003-820c-d39dc77a8147	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.3.2	Impairment	f	t
f00f7e89-2804-42c5-9f0c-4556b5b3fd9a	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.3.3	Restructuring Activities	f	t
5512a718-667c-45e0-95cf-5050010473dc	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.3.4	Disposals Of Non-Current Assets	f	t
2710cf76-9ca6-4db8-ac46-bc62eced7d4a	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.3.5	Disposals Of Property, Plant And Equipment	f	t
dbaa1dd4-1750-4f28-af58-a78e8038bd3e	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.3.6	Disposals Of Investment Properties	f	t
c8bc7167-498d-4c0d-9b7b-1e42e05ae120	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.3.7	Disposals Of Investments	f	t
c2fa722f-681d-4679-bc3d-39ddf67e45ba	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.3.8	Gains And Losses On Derivatives	f	t
d33b5faa-7ef7-4c1c-a43a-23249649fa37	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.3.9	Disposals Of Other Non-Current Assets	f	t
46377022-0344-4b44-a86f-1fb7908f4d02	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.3.10	Changes In Contingent Consideration	f	t
6a3863c1-517e-4fef-ad20-772d8811c834	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.3.11	Changes In Investment Property	f	t
ad9eb0d7-b8f0-4f08-b08d-b2b08389336b	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.3.12	Gain (Loss) On Liability Extinguishment	f	t
5b81235e-91a5-42f1-8d00-7c1645c61987	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.3.13	Expense (Income) On Discontinued Operations	f	t
587b24b4-fbc4-4cbc-b428-c8daadb37093	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.3.14	Litigation Settlements	f	t
eb34eea8-a53f-415f-b24e-b2eaff765d7f	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.3.15	Other Reversals Of Provisions	f	t
d4b73cde-469a-4352-a239-b03bfd53dcb6	afddaf0a-d0a6-4953-9dd0-7d12c3fd59d9	6.3.17	Cumulative Gain (Loss) From Reclassification To OCI	f	t
\.


--
-- Data for Name: ledger_entry; Type: TABLE DATA; Schema: public; Owner: cxjs
--

COPY ledger_entry (id, ledger_page_id, index, ledger_account_id, description, party_id, debit, credit, date) FROM stdin;
\.


--
-- Data for Name: ledger_page; Type: TABLE DATA; Schema: public; Owner: cxjs
--

COPY ledger_page (id, ledger_id, number, description, date) FROM stdin;
\.


--
-- Data for Name: party; Type: TABLE DATA; Schema: public; Owner: cxjs
--

COPY party (id, name, date, address1, address2, city, postal_code, country_code, tax_number, email, website, phone) FROM stdin;
3adfc972-515a-4845-851a-9f1c48cfd090	Codaxy d.o.o.	2020-06-19	1	2	Banja Luka	78000	Bosnia & Herzegovina	\N	hello@codaxy.com	https://www.codaxy.com	+38751922710
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: cxjs
--

COPY role (id, name, description, permissions) FROM stdin;
ce18f6a7-550a-4255-8c4c-17b0d181d28c	Administrator	Admin role	{ADMIN_USER_EDIT,ADMIN_USER_DELETE,ADMIN_USER_RESET_PASSWORD,ADMIN_USER_VIEW,ADMIN_ROLE_VIEW,ADMIN_ROLE_EDIT}
46a5b1f4-530e-4f95-845c-f23839a37d30	Demo role	Description	{ADMIN_USER_VIEW,ADMIN_USER_EDIT,ADMIN_ROLE_VIEW}
7b67ee25-f234-424c-a484-dd64684af026	Test	\N	{}
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: cxjs
--

COPY "user" (id, email, display_name, created_time, last_login_time, password_hash) FROM stdin;
f5011ef5-7596-4605-9af4-14925b42b776	test@example.com	Test12345	2020-06-02 21:22:30.39	\N	$2b$10$If3MJIUeVqT.yoYTIm5PiuTargXREOd5T0qfEghK8/AIoLdYjpfNK
18f2231b-5057-465d-b4f0-70eaee5a2e6f	test2	tews	2020-06-02 21:34:46.58	\N	\N
453ab134-154c-42ca-9aeb-bd6504efa0dc	test2@example.com	Test Administrator	2020-06-03 17:45:00.402	\N	\N
f02b9f8c-0b71-466d-91d7-8afe872b1d36	test	test	2020-06-05 06:34:31.864	\N	\N
\.


--
-- Data for Name: user_role; Type: TABLE DATA; Schema: public; Owner: cxjs
--

COPY user_role (user_id, role_id) FROM stdin;
18f2231b-5057-465d-b4f0-70eaee5a2e6f	46a5b1f4-530e-4f95-845c-f23839a37d30
18f2231b-5057-465d-b4f0-70eaee5a2e6f	7b67ee25-f234-424c-a484-dd64684af026
f02b9f8c-0b71-466d-91d7-8afe872b1d36	46a5b1f4-530e-4f95-845c-f23839a37d30
f02b9f8c-0b71-466d-91d7-8afe872b1d36	ce18f6a7-550a-4255-8c4c-17b0d181d28c
f02b9f8c-0b71-466d-91d7-8afe872b1d36	7b67ee25-f234-424c-a484-dd64684af026
18f2231b-5057-465d-b4f0-70eaee5a2e6f	ce18f6a7-550a-4255-8c4c-17b0d181d28c
453ab134-154c-42ca-9aeb-bd6504efa0dc	ce18f6a7-550a-4255-8c4c-17b0d181d28c
\.


--
-- Name: ledger_account_pk; Type: CONSTRAINT; Schema: public; Owner: cxjs; Tablespace: 
--

ALTER TABLE ONLY ledger_account
    ADD CONSTRAINT ledger_account_pk PRIMARY KEY (id);


--
-- Name: ledger_entry_pk; Type: CONSTRAINT; Schema: public; Owner: cxjs; Tablespace: 
--

ALTER TABLE ONLY ledger_entry
    ADD CONSTRAINT ledger_entry_pk PRIMARY KEY (id);


--
-- Name: ledger_page_pk; Type: CONSTRAINT; Schema: public; Owner: cxjs; Tablespace: 
--

ALTER TABLE ONLY ledger_page
    ADD CONSTRAINT ledger_page_pk PRIMARY KEY (id);


--
-- Name: ledger_pk; Type: CONSTRAINT; Schema: public; Owner: cxjs; Tablespace: 
--

ALTER TABLE ONLY ledger
    ADD CONSTRAINT ledger_pk PRIMARY KEY (id);


--
-- Name: party_pk; Type: CONSTRAINT; Schema: public; Owner: cxjs; Tablespace: 
--

ALTER TABLE ONLY party
    ADD CONSTRAINT party_pk PRIMARY KEY (id);


--
-- Name: role_pk; Type: CONSTRAINT; Schema: public; Owner: cxjs; Tablespace: 
--

ALTER TABLE ONLY role
    ADD CONSTRAINT role_pk PRIMARY KEY (id);


--
-- Name: user_pk; Type: CONSTRAINT; Schema: public; Owner: cxjs; Tablespace: 
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_pk PRIMARY KEY (id);


--
-- Name: user_role_pk; Type: CONSTRAINT; Schema: public; Owner: cxjs; Tablespace: 
--

ALTER TABLE ONLY user_role
    ADD CONSTRAINT user_role_pk PRIMARY KEY (user_id, role_id);


--
-- Name: ledger_account_ledger_id_code_uindex; Type: INDEX; Schema: public; Owner: cxjs; Tablespace: 
--

CREATE UNIQUE INDEX ledger_account_ledger_id_code_uindex ON ledger_account USING btree (ledger_id, code);


--
-- Name: user_email_uindex; Type: INDEX; Schema: public; Owner: cxjs; Tablespace: 
--

CREATE UNIQUE INDEX user_email_uindex ON "user" USING btree (email);


--
-- Name: ledger_account_ledger_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: cxjs
--

ALTER TABLE ONLY ledger_account
    ADD CONSTRAINT ledger_account_ledger_id_fk FOREIGN KEY (ledger_id) REFERENCES ledger(id);


--
-- Name: ledger_entry_ledger_account_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: cxjs
--

ALTER TABLE ONLY ledger_entry
    ADD CONSTRAINT ledger_entry_ledger_account_id_fk FOREIGN KEY (ledger_account_id) REFERENCES ledger_account(id);


--
-- Name: ledger_entry_ledger_page_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: cxjs
--

ALTER TABLE ONLY ledger_entry
    ADD CONSTRAINT ledger_entry_ledger_page_id_fk FOREIGN KEY (ledger_page_id) REFERENCES ledger_page(id);


--
-- Name: ledger_entry_party_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: cxjs
--

ALTER TABLE ONLY ledger_entry
    ADD CONSTRAINT ledger_entry_party_id_fk FOREIGN KEY (party_id) REFERENCES party(id);


--
-- Name: ledger_page_ledger_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: cxjs
--

ALTER TABLE ONLY ledger_page
    ADD CONSTRAINT ledger_page_ledger_id_fk FOREIGN KEY (ledger_id) REFERENCES ledger(id);


--
-- Name: user_role_role_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: cxjs
--

ALTER TABLE ONLY user_role
    ADD CONSTRAINT user_role_role_id_fk FOREIGN KEY (role_id) REFERENCES role(id);


--
-- Name: user_role_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: cxjs
--

ALTER TABLE ONLY user_role
    ADD CONSTRAINT user_role_user_id_fk FOREIGN KEY (user_id) REFERENCES "user"(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

