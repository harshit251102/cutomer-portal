import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Photo } from '../types/Customer';
import { UNSPLASH_API_ACCESS_KEY } from '../config';
import { ClipLoader } from 'react-spinners';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  width: 100%;
  height: calc(100vh - 120px);
  box-sizing: border-box;
`;

interface PhotoGridProps {
    customerId: number;
}

const PhotoContainer = styled.div`
  width: 100%;
  padding-top: 100%; 
  position: relative;
`;

const PhotoImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 300px;
`;

// We can use below data in case api rate limit exceeds

// const data = [
//     {
//         "id": "EmM5aPsakO0",
//         "slug": "a-white-car-parked-in-a-parking-garage-EmM5aPsakO0",
//         "alternative_slugs": {
//             "en": "a-white-car-parked-in-a-parking-garage-EmM5aPsakO0",
//             "es": "un-coche-blanco-aparcado-en-un-garaje-EmM5aPsakO0",
//             "ja": "駐車場に停められた白い車-EmM5aPsakO0",
//             "fr": "une-voiture-blanche-garee-dans-un-parking-EmM5aPsakO0",
//             "it": "unauto-bianca-parcheggiata-in-un-garage-EmM5aPsakO0",
//             "ko": "주차장에-주차된-흰색-자동차-EmM5aPsakO0",
//             "de": "ein-weisses-auto-das-in-einem-parkhaus-geparkt-ist-EmM5aPsakO0",
//             "pt": "um-carro-branco-estacionado-em-uma-garagem-EmM5aPsakO0"
//         },
//         "created_at": "2024-07-08T07:24:33Z",
//         "updated_at": "2024-08-08T00:03:29Z",
//         "promoted_at": "2024-07-11T13:01:09Z",
//         "width": 4000,
//         "height": 6000,
//         "color": "#595959",
//         "blur_hash": "LTC%Km-;M{RjjZbHWBWB00IU%Mt7",
//         "description": "LS 400",
//         "alt_description": "A white car parked in a parking garage",
//         "breadcrumbs": [],
//         "urls": {
//             "raw": "https://images.unsplash.com/photo-1720423413643-363310b689e8?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3",
//             "full": "https://images.unsplash.com/photo-1720423413643-363310b689e8?crop=entropy\u0026cs=srgb\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=85",
//             "regular": "https://images.unsplash.com/photo-1720423413643-363310b689e8?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=1080",
//             "small": "https://images.unsplash.com/photo-1720423413643-363310b689e8?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=400",
//             "thumb": "https://images.unsplash.com/photo-1720423413643-363310b689e8?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=200",
//             "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1720423413643-363310b689e8"
//         },
//         "links": {
//             "self": "https://api.unsplash.com/photos/a-white-car-parked-in-a-parking-garage-EmM5aPsakO0",
//             "html": "https://unsplash.com/photos/a-white-car-parked-in-a-parking-garage-EmM5aPsakO0",
//             "download": "https://unsplash.com/photos/EmM5aPsakO0/download?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8",
//             "download_location": "https://api.unsplash.com/photos/EmM5aPsakO0/download?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8"
//         },
//         "likes": 135,
//         "liked_by_user": false,
//         "current_user_collections": [],
//         "sponsorship": null,
//         "topic_submissions": {},
//         "asset_type": "photo",
//         "user": {
//             "id": "anB70-Vpzec",
//             "updated_at": "2024-08-09T11:09:03Z",
//             "username": "amein77",
//             "name": "amein shareef77",
//             "first_name": "amein",
//             "last_name": "shareef77",
//             "twitter_username": null,
//             "portfolio_url": null,
//             "bio": null,
//             "location": "Dubai",
//             "links": {
//                 "self": "https://api.unsplash.com/users/amein77",
//                 "html": "https://unsplash.com/@amein77",
//                 "photos": "https://api.unsplash.com/users/amein77/photos",
//                 "likes": "https://api.unsplash.com/users/amein77/likes",
//                 "portfolio": "https://api.unsplash.com/users/amein77/portfolio",
//                 "following": "https://api.unsplash.com/users/amein77/following",
//                 "followers": "https://api.unsplash.com/users/amein77/followers"
//             },
//             "profile_image": {
//                 "small": "https://images.unsplash.com/profile-1720423136420-f2c58c20c67c?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=32\u0026h=32",
//                 "medium": "https://images.unsplash.com/profile-1720423136420-f2c58c20c67c?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=64\u0026h=64",
//                 "large": "https://images.unsplash.com/profile-1720423136420-f2c58c20c67c?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=128\u0026h=128"
//             },
//             "instagram_username": "amei.n",
//             "total_collections": 0,
//             "total_likes": 0,
//             "total_photos": 23,
//             "total_promoted_photos": 2,
//             "total_illustrations": 0,
//             "total_promoted_illustrations": 0,
//             "accepted_tos": true,
//             "for_hire": false,
//             "social": {
//                 "instagram_username": "amei.n",
//                 "portfolio_url": null,
//                 "twitter_username": null,
//                 "paypal_email": null
//             }
//         },
//         "exif": {
//             "make": "SONY",
//             "model": "ILCE-7M3",
//             "name": "SONY, ILCE-7M3",
//             "exposure_time": "1/1000",
//             "aperture": "2.8",
//             "focal_length": "24.0",
//             "iso": 250
//         },
//         "location": {
//             "name": "Dubai - United Arab Emirates",
//             "city": "Dubai",
//             "country": "United Arab Emirates",
//             "position": {
//                 "latitude": 25.204849,
//                 "longitude": 55.270783
//             }
//         },
//         "views": 791724,
//         "downloads": 7882
//     },
//     {
//         "id": "o1je1MRR_c8",
//         "slug": "a-very-tall-mountain-covered-in-snow-under-a-cloudy-sky-o1je1MRR_c8",
//         "alternative_slugs": {
//             "en": "a-very-tall-mountain-covered-in-snow-under-a-cloudy-sky-o1je1MRR_c8",
//             "es": "una-montana-muy-alta-cubierta-de-nieve-bajo-un-cielo-nublado-o1je1MRR_c8",
//             "ja": "曇り空の下雪に覆われたとても高い山-o1je1MRR_c8",
//             "fr": "une-tres-haute-montagne-recouverte-de-neige-sous-un-ciel-nuageux-o1je1MRR_c8",
//             "it": "una-montagna-altissima-coperta-di-neve-sotto-un-cielo-nuvoloso-o1je1MRR_c8",
//             "ko": "구름-낀-하늘-아래-눈으로-덮인-매우-높은-산-o1je1MRR_c8",
//             "de": "ein-sehr-hoher-berg-der-unter-einem-bewolkten-himmel-mit-schnee-bedeckt-ist-o1je1MRR_c8",
//             "pt": "uma-montanha-muito-alta-coberta-de-neve-sob-um-ceu-nublado-o1je1MRR_c8"
//         },
//         "created_at": "2024-07-13T18:35:53Z",
//         "updated_at": "2024-08-10T03:12:05Z",
//         "promoted_at": "2024-07-15T12:29:56Z",
//         "width": 3648,
//         "height": 5472,
//         "color": "#a68ca6",
//         "blur_hash": "LVF#wPNGERt4_4g3f6oeF}xa-5R.",
//         "description": "\"Grace\"",
//         "alt_description": "A very tall mountain covered in snow under a cloudy sky",
//         "breadcrumbs": [],
//         "urls": {
//             "raw": "https://images.unsplash.com/photo-1720895609364-45a8dd86155d?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3",
//             "full": "https://images.unsplash.com/photo-1720895609364-45a8dd86155d?crop=entropy\u0026cs=srgb\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=85",
//             "regular": "https://images.unsplash.com/photo-1720895609364-45a8dd86155d?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=1080",
//             "small": "https://images.unsplash.com/photo-1720895609364-45a8dd86155d?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=400",
//             "thumb": "https://images.unsplash.com/photo-1720895609364-45a8dd86155d?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=200",
//             "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1720895609364-45a8dd86155d"
//         },
//         "links": {
//             "self": "https://api.unsplash.com/photos/a-very-tall-mountain-covered-in-snow-under-a-cloudy-sky-o1je1MRR_c8",
//             "html": "https://unsplash.com/photos/a-very-tall-mountain-covered-in-snow-under-a-cloudy-sky-o1je1MRR_c8",
//             "download": "https://unsplash.com/photos/o1je1MRR_c8/download?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8",
//             "download_location": "https://api.unsplash.com/photos/o1je1MRR_c8/download?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8"
//         },
//         "likes": 177,
//         "liked_by_user": false,
//         "current_user_collections": [],
//         "sponsorship": null,
//         "topic_submissions": {
//             "golden-hour": {
//                 "status": "approved",
//                 "approved_on": "2024-07-15T13:43:39Z"
//             },
//             "health": {
//                 "status": "rejected"
//             },
//             "nature": {
//                 "status": "approved",
//                 "approved_on": "2024-07-15T14:04:53Z"
//             },
//             "spirituality": {
//                 "status": "approved",
//                 "approved_on": "2024-07-15T14:22:43Z"
//             },
//             "textures-patterns": {
//                 "status": "rejected"
//             },
//             "travel": {
//                 "status": "approved",
//                 "approved_on": "2024-07-15T14:08:59Z"
//             },
//             "wallpapers": {
//                 "status": "approved",
//                 "approved_on": "2024-07-15T13:52:22Z"
//             }
//         },
//         "asset_type": "photo",
//         "user": {
//             "id": "2tXKaPcv9BI",
//             "updated_at": "2024-08-10T09:28:46Z",
//             "username": "marekpiwnicki",
//             "name": "Marek Piwnicki",
//             "first_name": "Marek",
//             "last_name": "Piwnicki",
//             "twitter_username": null,
//             "portfolio_url": "https://marpiwnicki.github.io",
//             "bio": "Hey! I have 2.5B+ views and 10M+ dwnl here.If my work has helped or inspired you, please consider supporting me (patreon.com/MarekPiwnicki or ko-fi.com/marekpiwnicki). Every bit helps me continue creating and sharing my photos for free. Thank you! ❤️",
//             "location": "Gdynia | Poland",
//             "links": {
//                 "self": "https://api.unsplash.com/users/marekpiwnicki",
//                 "html": "https://unsplash.com/@marekpiwnicki",
//                 "photos": "https://api.unsplash.com/users/marekpiwnicki/photos",
//                 "likes": "https://api.unsplash.com/users/marekpiwnicki/likes",
//                 "portfolio": "https://api.unsplash.com/users/marekpiwnicki/portfolio",
//                 "following": "https://api.unsplash.com/users/marekpiwnicki/following",
//                 "followers": "https://api.unsplash.com/users/marekpiwnicki/followers"
//             },
//             "profile_image": {
//                 "small": "https://images.unsplash.com/profile-1604758536753-68fd6f23aaf7image?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=32\u0026h=32",
//                 "medium": "https://images.unsplash.com/profile-1604758536753-68fd6f23aaf7image?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=64\u0026h=64",
//                 "large": "https://images.unsplash.com/profile-1604758536753-68fd6f23aaf7image?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=128\u0026h=128"
//             },
//             "instagram_username": "marekpiwnicki",
//             "total_collections": 44,
//             "total_likes": 1992,
//             "total_photos": 3682,
//             "total_promoted_photos": 738,
//             "total_illustrations": 0,
//             "total_promoted_illustrations": 0,
//             "accepted_tos": true,
//             "for_hire": true,
//             "social": {
//                 "instagram_username": "marekpiwnicki",
//                 "portfolio_url": "https://marpiwnicki.github.io",
//                 "twitter_username": null,
//                 "paypal_email": null
//             }
//         },
//         "exif": {
//             "make": "Canon",
//             "model": " EOS R6",
//             "name": "Canon, EOS R6",
//             "exposure_time": "1/100",
//             "aperture": "7.1",
//             "focal_length": "225.0",
//             "iso": 400
//         },
//         "location": {
//             "name": "Torres del Paine, Torres de Paine, Chile",
//             "city": null,
//             "country": "Chile",
//             "position": {
//                 "latitude": -51.0,
//                 "longitude": -73.0
//             }
//         },
//         "views": 3570464,
//         "downloads": 62244
//     },
//     {
//         "id": "hC2csmyGf94",
//         "slug": "a-narrow-city-street-with-buildings-in-the-background-hC2csmyGf94",
//         "alternative_slugs": {
//             "en": "a-narrow-city-street-with-buildings-in-the-background-hC2csmyGf94",
//             "es": "una-calle-estrecha-de-la-ciudad-con-edificios-al-fondo-hC2csmyGf94",
//             "ja": "建物を背景にした狭い街並み-hC2csmyGf94",
//             "fr": "une-rue-etroite-de-la-ville-avec-des-batiments-en-arriere-plan-hC2csmyGf94",
//             "it": "una-stretta-strada-cittadina-con-edifici-sullo-sfondo-hC2csmyGf94",
//             "ko": "건물을-배경으로-한-좁은-도시-거리-hC2csmyGf94",
//             "de": "eine-schmale-stadtstrasse-mit-gebauden-im-hintergrund-hC2csmyGf94",
//             "pt": "uma-rua-estreita-da-cidade-com-edificios-ao-fundo-hC2csmyGf94"
//         },
//         "created_at": "2024-07-14T07:46:37Z",
//         "updated_at": "2024-08-09T18:00:03Z",
//         "promoted_at": "2024-08-09T08:34:29Z",
//         "width": 4143,
//         "height": 6215,
//         "color": "#595959",
//         "blur_hash": "LcF~N;kr9FRj~WozIUV@%gjuV@W;",
//         "description": null,
//         "alt_description": "A narrow city street with buildings in the background",
//         "breadcrumbs": [],
//         "urls": {
//             "raw": "https://images.unsplash.com/photo-1720941001973-e3a1fb01f523?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3",
//             "full": "https://images.unsplash.com/photo-1720941001973-e3a1fb01f523?crop=entropy\u0026cs=srgb\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=85",
//             "regular": "https://images.unsplash.com/photo-1720941001973-e3a1fb01f523?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=1080",
//             "small": "https://images.unsplash.com/photo-1720941001973-e3a1fb01f523?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=400",
//             "thumb": "https://images.unsplash.com/photo-1720941001973-e3a1fb01f523?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=200",
//             "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1720941001973-e3a1fb01f523"
//         },
//         "links": {
//             "self": "https://api.unsplash.com/photos/a-narrow-city-street-with-buildings-in-the-background-hC2csmyGf94",
//             "html": "https://unsplash.com/photos/a-narrow-city-street-with-buildings-in-the-background-hC2csmyGf94",
//             "download": "https://unsplash.com/photos/hC2csmyGf94/download?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8",
//             "download_location": "https://api.unsplash.com/photos/hC2csmyGf94/download?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8"
//         },
//         "likes": 20,
//         "liked_by_user": false,
//         "current_user_collections": [],
//         "sponsorship": null,
//         "topic_submissions": {
//             "street-photography": {
//                 "status": "approved",
//                 "approved_on": "2024-07-14T08:05:57Z"
//             }
//         },
//         "asset_type": "photo",
//         "user": {
//             "id": "-XGUxz78mIc",
//             "updated_at": "2024-08-10T11:51:35Z",
//             "username": "neonboiiz",
//             "name": "Anthony Lim",
//             "first_name": "Anthony",
//             "last_name": "Lim",
//             "twitter_username": null,
//             "portfolio_url": "http://anthonylim.net",
//             "bio": "Just an actor who captures life with his Fujifilm XT4.",
//             "location": "Melbourne, Australia",
//             "links": {
//                 "self": "https://api.unsplash.com/users/neonboiiz",
//                 "html": "https://unsplash.com/@neonboiiz",
//                 "photos": "https://api.unsplash.com/users/neonboiiz/photos",
//                 "likes": "https://api.unsplash.com/users/neonboiiz/likes",
//                 "portfolio": "https://api.unsplash.com/users/neonboiiz/portfolio",
//                 "following": "https://api.unsplash.com/users/neonboiiz/following",
//                 "followers": "https://api.unsplash.com/users/neonboiiz/followers"
//             },
//             "profile_image": {
//                 "small": "https://images.unsplash.com/profile-1721211841499-0251db3ddf90image?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=32\u0026h=32",
//                 "medium": "https://images.unsplash.com/profile-1721211841499-0251db3ddf90image?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=64\u0026h=64",
//                 "large": "https://images.unsplash.com/profile-1721211841499-0251db3ddf90image?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=128\u0026h=128"
//             },
//             "instagram_username": "neonboiiz",
//             "total_collections": 0,
//             "total_likes": 8,
//             "total_photos": 409,
//             "total_promoted_photos": 9,
//             "total_illustrations": 0,
//             "total_promoted_illustrations": 0,
//             "accepted_tos": true,
//             "for_hire": true,
//             "social": {
//                 "instagram_username": "neonboiiz",
//                 "portfolio_url": "http://anthonylim.net",
//                 "twitter_username": null,
//                 "paypal_email": null
//             }
//         },
//         "exif": {
//             "make": "FUJIFILM",
//             "model": "X-T4",
//             "name": "FUJIFILM, X-T4",
//             "exposure_time": "1/25",
//             "aperture": "8.0",
//             "focal_length": "23.0",
//             "iso": 400
//         },
//         "location": {
//             "name": "Singapore",
//             "city": null,
//             "country": "Singapore",
//             "position": {
//                 "latitude": 1.352083,
//                 "longitude": 103.819836
//             }
//         },
//         "views": 48058,
//         "downloads": 812
//     },
//     {
//         "id": "xNwes5lgEvI",
//         "slug": "a-person-laying-on-the-floor-in-a-dark-hallway-xNwes5lgEvI",
//         "alternative_slugs": {
//             "en": "a-person-laying-on-the-floor-in-a-dark-hallway-xNwes5lgEvI",
//             "es": "una-persona-tirada-en-el-suelo-en-un-pasillo-oscuro-xNwes5lgEvI",
//             "ja": "暗い廊下の床に横たわる人物-xNwes5lgEvI",
//             "fr": "une-personne-allongee-sur-le-sol-dans-un-couloir-sombre-xNwes5lgEvI",
//             "it": "una-persona-sdraiata-sul-pavimento-in-un-corridoio-buio-xNwes5lgEvI",
//             "ko": "어두운-복도에서-바닥에-누워-있는-사람-xNwes5lgEvI",
//             "de": "eine-person-die-in-einem-dunklen-flur-auf-dem-boden-liegt-xNwes5lgEvI",
//             "pt": "uma-pessoa-deitada-no-chao-em-um-corredor-escuro-xNwes5lgEvI"
//         },
//         "created_at": "2024-07-14T09:32:17Z",
//         "updated_at": "2024-08-08T00:33:17Z",
//         "promoted_at": "2024-07-14T11:57:59Z",
//         "width": 4121,
//         "height": 5996,
//         "color": "#0c2626",
//         "blur_hash": "L23I#AJ88w$%o}j@RPWV4T$M.SJU",
//         "description": null,
//         "alt_description": "A person laying on the floor in a dark hallway",
//         "breadcrumbs": [],
//         "urls": {
//             "raw": "https://images.unsplash.com/photo-1720949442867-77cfc1414b5d?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3",
//             "full": "https://images.unsplash.com/photo-1720949442867-77cfc1414b5d?crop=entropy\u0026cs=srgb\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=85",
//             "regular": "https://images.unsplash.com/photo-1720949442867-77cfc1414b5d?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=1080",
//             "small": "https://images.unsplash.com/photo-1720949442867-77cfc1414b5d?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=400",
//             "thumb": "https://images.unsplash.com/photo-1720949442867-77cfc1414b5d?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=200",
//             "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1720949442867-77cfc1414b5d"
//         },
//         "links": {
//             "self": "https://api.unsplash.com/photos/a-person-laying-on-the-floor-in-a-dark-hallway-xNwes5lgEvI",
//             "html": "https://unsplash.com/photos/a-person-laying-on-the-floor-in-a-dark-hallway-xNwes5lgEvI",
//             "download": "https://unsplash.com/photos/xNwes5lgEvI/download?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8",
//             "download_location": "https://api.unsplash.com/photos/xNwes5lgEvI/download?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8"
//         },
//         "likes": 48,
//         "liked_by_user": false,
//         "current_user_collections": [],
//         "sponsorship": null,
//         "topic_submissions": {},
//         "asset_type": "photo",
//         "user": {
//             "id": "8AQegibHqlo",
//             "updated_at": "2024-08-10T11:53:30Z",
//             "username": "adityaries",
//             "name": "Aditya Saxena",
//             "first_name": "Aditya",
//             "last_name": "Saxena",
//             "twitter_username": null,
//             "portfolio_url": "http://linktr.ee/iamsaxenaditya",
//             "bio": "Send me the links of articles where ever you use my photograph :)\r\nI'll be happy to see my work around the world.",
//             "location": "Delhi, India",
//             "links": {
//                 "self": "https://api.unsplash.com/users/adityaries",
//                 "html": "https://unsplash.com/@adityaries",
//                 "photos": "https://api.unsplash.com/users/adityaries/photos",
//                 "likes": "https://api.unsplash.com/users/adityaries/likes",
//                 "portfolio": "https://api.unsplash.com/users/adityaries/portfolio",
//                 "following": "https://api.unsplash.com/users/adityaries/following",
//                 "followers": "https://api.unsplash.com/users/adityaries/followers"
//             },
//             "profile_image": {
//                 "small": "https://images.unsplash.com/profile-1721166982807-607b83fa16ddimage?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=32\u0026h=32",
//                 "medium": "https://images.unsplash.com/profile-1721166982807-607b83fa16ddimage?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=64\u0026h=64",
//                 "large": "https://images.unsplash.com/profile-1721166982807-607b83fa16ddimage?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=128\u0026h=128"
//             },
//             "instagram_username": "adityaries",
//             "total_collections": 8,
//             "total_likes": 315,
//             "total_photos": 445,
//             "total_promoted_photos": 17,
//             "total_illustrations": 0,
//             "total_promoted_illustrations": 0,
//             "accepted_tos": true,
//             "for_hire": true,
//             "social": {
//                 "instagram_username": "adityaries",
//                 "portfolio_url": "http://linktr.ee/iamsaxenaditya",
//                 "twitter_username": null,
//                 "paypal_email": null
//             }
//         },
//         "exif": {
//             "make": null,
//             "model": null,
//             "name": null,
//             "exposure_time": null,
//             "aperture": null,
//             "focal_length": null,
//             "iso": null
//         },
//         "location": {
//             "name": null,
//             "city": null,
//             "country": null,
//             "position": {
//                 "latitude": 0.0,
//                 "longitude": 0.0
//             }
//         },
//         "views": 221829,
//         "downloads": 3722
//     },
//     {
//         "id": "L0VrpZARWIs",
//         "slug": "an-unmade-bed-with-white-sheets-and-pillows-L0VrpZARWIs",
//         "alternative_slugs": {
//             "en": "an-unmade-bed-with-white-sheets-and-pillows-L0VrpZARWIs",
//             "es": "una-cama-deshecha-con-sabanas-y-almohadas-blancas-L0VrpZARWIs",
//             "ja": "白いシーツと枕が置かれた未完成のベッド-L0VrpZARWIs",
//             "fr": "un-lit-defait-avec-des-draps-et-des-oreillers-blancs-L0VrpZARWIs",
//             "it": "un-letto-disfatto-con-lenzuola-e-cuscini-bianchi-L0VrpZARWIs",
//             "ko": "흰-시트와-베개가-깔려-있는-정돈되지-않은-침대-L0VrpZARWIs",
//             "de": "ein-ungemachtes-bett-mit-weissen-laken-und-kissen-L0VrpZARWIs",
//             "pt": "uma-cama-desfeita-com-lencois-e-travesseiros-brancos-L0VrpZARWIs"
//         },
//         "created_at": "2024-07-15T20:09:33Z",
//         "updated_at": "2024-08-09T07:36:33Z",
//         "promoted_at": "2024-08-02T09:30:18Z",
//         "width": 3712,
//         "height": 5568,
//         "color": "#c0c0c0",
//         "blur_hash": "L9J*kwDhWBWBDNaeozofaxofROMx",
//         "description": null,
//         "alt_description": "An unmade bed with white sheets and pillows",
//         "breadcrumbs": [],
//         "urls": {
//             "raw": "https://images.unsplash.com/photo-1721073956820-644a71ba075e?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3",
//             "full": "https://images.unsplash.com/photo-1721073956820-644a71ba075e?crop=entropy\u0026cs=srgb\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=85",
//             "regular": "https://images.unsplash.com/photo-1721073956820-644a71ba075e?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=1080",
//             "small": "https://images.unsplash.com/photo-1721073956820-644a71ba075e?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=400",
//             "thumb": "https://images.unsplash.com/photo-1721073956820-644a71ba075e?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=200",
//             "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1721073956820-644a71ba075e"
//         },
//         "links": {
//             "self": "https://api.unsplash.com/photos/an-unmade-bed-with-white-sheets-and-pillows-L0VrpZARWIs",
//             "html": "https://unsplash.com/photos/an-unmade-bed-with-white-sheets-and-pillows-L0VrpZARWIs",
//             "download": "https://unsplash.com/photos/L0VrpZARWIs/download?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8",
//             "download_location": "https://api.unsplash.com/photos/L0VrpZARWIs/download?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8"
//         },
//         "likes": 43,
//         "liked_by_user": false,
//         "current_user_collections": [],
//         "sponsorship": null,
//         "topic_submissions": {},
//         "asset_type": "photo",
//         "user": {
//             "id": "F4C4lH_keQo",
//             "updated_at": "2024-08-10T09:51:12Z",
//             "username": "dinamakhmutova",
//             "name": "Dina Makhmutova",
//             "first_name": "Dina",
//             "last_name": "Makhmutova",
//             "twitter_username": null,
//             "portfolio_url": null,
//             "bio": null,
//             "location": null,
//             "links": {
//                 "self": "https://api.unsplash.com/users/dinamakhmutova",
//                 "html": "https://unsplash.com/@dinamakhmutova",
//                 "photos": "https://api.unsplash.com/users/dinamakhmutova/photos",
//                 "likes": "https://api.unsplash.com/users/dinamakhmutova/likes",
//                 "portfolio": "https://api.unsplash.com/users/dinamakhmutova/portfolio",
//                 "following": "https://api.unsplash.com/users/dinamakhmutova/following",
//                 "followers": "https://api.unsplash.com/users/dinamakhmutova/followers"
//             },
//             "profile_image": {
//                 "small": "https://images.unsplash.com/profile-1719702276303-742db47db373image?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=32\u0026h=32",
//                 "medium": "https://images.unsplash.com/profile-1719702276303-742db47db373image?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=64\u0026h=64",
//                 "large": "https://images.unsplash.com/profile-1719702276303-742db47db373image?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=128\u0026h=128"
//             },
//             "instagram_username": null,
//             "total_collections": 0,
//             "total_likes": 0,
//             "total_photos": 51,
//             "total_promoted_photos": 1,
//             "total_illustrations": 0,
//             "total_promoted_illustrations": 0,
//             "accepted_tos": true,
//             "for_hire": true,
//             "social": {
//                 "instagram_username": null,
//                 "portfolio_url": null,
//                 "twitter_username": null,
//                 "paypal_email": null
//             }
//         },
//         "exif": {
//             "make": "NIKON CORPORATION",
//             "model": "NIKON D7500",
//             "name": "NIKON CORPORATION, NIKON D7500",
//             "exposure_time": "1/160",
//             "aperture": "6.3",
//             "focal_length": "50.0",
//             "iso": 320
//         },
//         "location": {
//             "name": null,
//             "city": null,
//             "country": null,
//             "position": {
//                 "latitude": 0.0,
//                 "longitude": 0.0
//             }
//         },
//         "views": 130973,
//         "downloads": 2909
//     },
//     {
//         "id": "Iju9-wylmLo",
//         "slug": "a-row-of-brick-buildings-with-a-clock-tower-in-the-background-Iju9-wylmLo",
//         "alternative_slugs": {
//             "en": "a-row-of-brick-buildings-with-a-clock-tower-in-the-background-Iju9-wylmLo",
//             "es": "una-hilera-de-edificios-de-ladrillo-con-una-torre-de-reloj-al-fondo-Iju9-wylmLo",
//             "ja": "時計塔を背景にしたレンガ造りの建物が立ち並ぶ-Iju9-wylmLo",
//             "fr": "une-rangee-de-batiments-en-briques-avec-une-tour-dhorloge-en-arriere-plan-Iju9-wylmLo",
//             "it": "una-fila-di-edifici-in-mattoni-con-una-torre-dellorologio-sullo-sfondo-Iju9-wylmLo",
//             "ko": "시계탑을-배경으로-벽돌-건물이-줄지어-있습니다-Iju9-wylmLo",
//             "de": "eine-reihe-von-backsteingebauden-mit-einem-uhrenturm-im-hintergrund-Iju9-wylmLo",
//             "pt": "uma-fileira-de-edificios-de-tijolos-com-uma-torre-de-relogio-ao-fundo-Iju9-wylmLo"
//         },
//         "created_at": "2024-07-17T10:47:09Z",
//         "updated_at": "2024-08-08T00:10:45Z",
//         "promoted_at": "2024-07-19T15:28:00Z",
//         "width": 5464,
//         "height": 8192,
//         "color": "#f3f3f3",
//         "blur_hash": "L$N17JRkRia#_NtQWBoLRjbFt7ay",
//         "description": "Vicars' Close, Wells. Thought to be the only intact medieval street left in England.",
//         "alt_description": "A row of brick buildings with a clock tower in the background",
//         "breadcrumbs": [],
//         "urls": {
//             "raw": "https://images.unsplash.com/photo-1721213126898-672d2c6f9b96?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3",
//             "full": "https://images.unsplash.com/photo-1721213126898-672d2c6f9b96?crop=entropy\u0026cs=srgb\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=85",
//             "regular": "https://images.unsplash.com/photo-1721213126898-672d2c6f9b96?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=1080",
//             "small": "https://images.unsplash.com/photo-1721213126898-672d2c6f9b96?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=400",
//             "thumb": "https://images.unsplash.com/photo-1721213126898-672d2c6f9b96?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=200",
//             "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1721213126898-672d2c6f9b96"
//         },
//         "links": {
//             "self": "https://api.unsplash.com/photos/a-row-of-brick-buildings-with-a-clock-tower-in-the-background-Iju9-wylmLo",
//             "html": "https://unsplash.com/photos/a-row-of-brick-buildings-with-a-clock-tower-in-the-background-Iju9-wylmLo",
//             "download": "https://unsplash.com/photos/Iju9-wylmLo/download?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8",
//             "download_location": "https://api.unsplash.com/photos/Iju9-wylmLo/download?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8"
//         },
//         "likes": 40,
//         "liked_by_user": false,
//         "current_user_collections": [],
//         "sponsorship": null,
//         "topic_submissions": {},
//         "asset_type": "photo",
//         "user": {
//             "id": "IFcEhJqem0Q",
//             "updated_at": "2024-08-10T11:51:52Z",
//             "username": "anniespratt",
//             "name": "Annie Spratt",
//             "first_name": "Annie",
//             "last_name": "Spratt",
//             "twitter_username": "anniespratt",
//             "portfolio_url": "https://www.anniespratt.com",
//             "bio": "Hobbyist photographer from England, sharing my digital, film + vintage slide scans. Shooting a roll of film every day in 2024.",
//             "location": "New Forest National Park, UK",
//             "links": {
//                 "self": "https://api.unsplash.com/users/anniespratt",
//                 "html": "https://unsplash.com/@anniespratt",
//                 "photos": "https://api.unsplash.com/users/anniespratt/photos",
//                 "likes": "https://api.unsplash.com/users/anniespratt/likes",
//                 "portfolio": "https://api.unsplash.com/users/anniespratt/portfolio",
//                 "following": "https://api.unsplash.com/users/anniespratt/following",
//                 "followers": "https://api.unsplash.com/users/anniespratt/followers"
//             },
//             "profile_image": {
//                 "small": "https://images.unsplash.com/profile-1648828806223-1852f704c58aimage?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=32\u0026h=32",
//                 "medium": "https://images.unsplash.com/profile-1648828806223-1852f704c58aimage?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=64\u0026h=64",
//                 "large": "https://images.unsplash.com/profile-1648828806223-1852f704c58aimage?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=128\u0026h=128"
//             },
//             "instagram_username": "anniespratt",
//             "total_collections": 76,
//             "total_likes": 14508,
//             "total_photos": 24327,
//             "total_promoted_photos": 3098,
//             "total_illustrations": 3,
//             "total_promoted_illustrations": 0,
//             "accepted_tos": true,
//             "for_hire": false,
//             "social": {
//                 "instagram_username": "anniespratt",
//                 "portfolio_url": "https://www.anniespratt.com",
//                 "twitter_username": "anniespratt",
//                 "paypal_email": null
//             }
//         },
//         "exif": {
//             "make": null,
//             "model": null,
//             "name": null,
//             "exposure_time": null,
//             "aperture": null,
//             "focal_length": null,
//             "iso": null
//         },
//         "location": {
//             "name": "Vicars' Close, Wells, UK",
//             "city": null,
//             "country": "United Kingdom",
//             "position": {
//                 "latitude": 51.211538,
//                 "longitude": -2.64373
//             }
//         },
//         "views": 235360,
//         "downloads": 3997
//     },
//     {
//         "id": "OavUdomWdIc",
//         "slug": "a-close-up-view-of-a-star-cluster-OavUdomWdIc",
//         "alternative_slugs": {
//             "en": "a-close-up-view-of-a-star-cluster-OavUdomWdIc",
//             "es": "un-primer-plano-de-un-cumulo-estelar-OavUdomWdIc",
//             "ja": "星団の拡大図-OavUdomWdIc",
//             "fr": "vue-rapprochee-dun-amas-detoiles-OavUdomWdIc",
//             "it": "una-vista-ravvicinata-di-un-ammasso-stellare-OavUdomWdIc",
//             "ko": "성단의-클로즈업-모습-OavUdomWdIc",
//             "de": "nahaufnahme-eines-sternhaufens-OavUdomWdIc",
//             "pt": "uma-visao-de-perto-de-um-aglomerado-estelar-OavUdomWdIc"
//         },
//         "created_at": "2024-07-18T14:48:25Z",
//         "updated_at": "2024-08-07T23:47:44Z",
//         "promoted_at": "2024-07-20T08:36:10Z",
//         "width": 2863,
//         "height": 2893,
//         "color": "#8c5940",
//         "blur_hash": "LBEmzX}p-A=^5S-A-AI;0~ENRmsV",
//         "description": "A portion of the Small Sagittarius Star Cloud (M24). This view is looking inward towards the core of the Milky Way across some 2000 to 3000 light years to the Sagittarius-Carina arm of the galaxy.",
//         "alt_description": "A close up view of a star cluster",
//         "breadcrumbs": [],
//         "urls": {
//             "raw": "https://images.unsplash.com/photo-1721313859415-706a15eecbed?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3",
//             "full": "https://images.unsplash.com/photo-1721313859415-706a15eecbed?crop=entropy\u0026cs=srgb\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=85",
//             "regular": "https://images.unsplash.com/photo-1721313859415-706a15eecbed?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=1080",
//             "small": "https://images.unsplash.com/photo-1721313859415-706a15eecbed?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=400",
//             "thumb": "https://images.unsplash.com/photo-1721313859415-706a15eecbed?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=200",
//             "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1721313859415-706a15eecbed"
//         },
//         "links": {
//             "self": "https://api.unsplash.com/photos/a-close-up-view-of-a-star-cluster-OavUdomWdIc",
//             "html": "https://unsplash.com/photos/a-close-up-view-of-a-star-cluster-OavUdomWdIc",
//             "download": "https://unsplash.com/photos/OavUdomWdIc/download?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8",
//             "download_location": "https://api.unsplash.com/photos/OavUdomWdIc/download?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8"
//         },
//         "likes": 92,
//         "liked_by_user": false,
//         "current_user_collections": [],
//         "sponsorship": null,
//         "topic_submissions": {},
//         "asset_type": "photo",
//         "user": {
//             "id": "NQUZ5XH48y0",
//             "updated_at": "2024-08-09T21:10:37Z",
//             "username": "darkcatimages",
//             "name": "Scott Lord",
//             "first_name": "Scott",
//             "last_name": "Lord",
//             "twitter_username": null,
//             "portfolio_url": "http://scottlord.viewbug.com",
//             "bio": "Amatuer astrophotographer just wanting to share the beauty of the night sky. I've been doing some form of astronomy since I was eight years old and have been looking up ever since! all of my photos are taken in my backyard unless otherwise noted.",
//             "location": "Northcentral Kentucky, USA",
//             "links": {
//                 "self": "https://api.unsplash.com/users/darkcatimages",
//                 "html": "https://unsplash.com/@darkcatimages",
//                 "photos": "https://api.unsplash.com/users/darkcatimages/photos",
//                 "likes": "https://api.unsplash.com/users/darkcatimages/likes",
//                 "portfolio": "https://api.unsplash.com/users/darkcatimages/portfolio",
//                 "following": "https://api.unsplash.com/users/darkcatimages/following",
//                 "followers": "https://api.unsplash.com/users/darkcatimages/followers"
//             },
//             "profile_image": {
//                 "small": "https://images.unsplash.com/profile-1684018233062-7f02f112e6ebimage?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=32\u0026h=32",
//                 "medium": "https://images.unsplash.com/profile-1684018233062-7f02f112e6ebimage?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=64\u0026h=64",
//                 "large": "https://images.unsplash.com/profile-1684018233062-7f02f112e6ebimage?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=128\u0026h=128"
//             },
//             "instagram_username": "darkcatimages",
//             "total_collections": 0,
//             "total_likes": 1,
//             "total_photos": 31,
//             "total_promoted_photos": 26,
//             "total_illustrations": 0,
//             "total_promoted_illustrations": 0,
//             "accepted_tos": true,
//             "for_hire": false,
//             "social": {
//                 "instagram_username": "darkcatimages",
//                 "portfolio_url": "http://scottlord.viewbug.com",
//                 "twitter_username": null,
//                 "paypal_email": null
//             }
//         },
//         "exif": {
//             "make": null,
//             "model": null,
//             "name": null,
//             "exposure_time": null,
//             "aperture": null,
//             "focal_length": null,
//             "iso": null
//         },
//         "location": {
//             "name": null,
//             "city": null,
//             "country": null,
//             "position": {
//                 "latitude": 0.0,
//                 "longitude": 0.0
//             }
//         },
//         "views": 545687,
//         "downloads": 7494
//     },
//     {
//         "id": "62ERHLjqfqk",
//         "slug": "the-sun-is-shining-through-the-trees-in-the-forest-62ERHLjqfqk",
//         "alternative_slugs": {
//             "en": "the-sun-is-shining-through-the-trees-in-the-forest-62ERHLjqfqk",
//             "es": "el-sol-brilla-a-traves-de-los-arboles-del-bosque-62ERHLjqfqk",
//             "ja": "森の木々の間から太陽が差し込んでいます-62ERHLjqfqk",
//             "fr": "le-soleil-brille-a-travers-les-arbres-de-la-foret-62ERHLjqfqk",
//             "it": "il-sole-splende-tra-gli-alberi-della-foresta-62ERHLjqfqk",
//             "ko": "숲-속의-나무-사이로-태양이-빛나고-있습니다-62ERHLjqfqk",
//             "de": "die-sonne-scheint-durch-die-baume-im-wald-62ERHLjqfqk",
//             "pt": "o-sol-esta-brilhando-atraves-das-arvores-na-floresta-62ERHLjqfqk"
//         },
//         "created_at": "2024-07-19T16:09:55Z",
//         "updated_at": "2024-08-07T23:45:50Z",
//         "promoted_at": "2024-07-19T16:15:41Z",
//         "width": 8192,
//         "height": 5464,
//         "color": "#26260c",
//         "blur_hash": "LNCi~$%M01ay-;xuofR*ITj[%MWU",
//         "description": null,
//         "alt_description": "The sun is shining through the trees in the forest",
//         "breadcrumbs": [],
//         "urls": {
//             "raw": "https://images.unsplash.com/photo-1721404832661-658016cde3d4?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3",
//             "full": "https://images.unsplash.com/photo-1721404832661-658016cde3d4?crop=entropy\u0026cs=srgb\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=85",
//             "regular": "https://images.unsplash.com/photo-1721404832661-658016cde3d4?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=1080",
//             "small": "https://images.unsplash.com/photo-1721404832661-658016cde3d4?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=400",
//             "thumb": "https://images.unsplash.com/photo-1721404832661-658016cde3d4?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=200",
//             "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1721404832661-658016cde3d4"
//         },
//         "links": {
//             "self": "https://api.unsplash.com/photos/the-sun-is-shining-through-the-trees-in-the-forest-62ERHLjqfqk",
//             "html": "https://unsplash.com/photos/the-sun-is-shining-through-the-trees-in-the-forest-62ERHLjqfqk",
//             "download": "https://unsplash.com/photos/62ERHLjqfqk/download?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8",
//             "download_location": "https://api.unsplash.com/photos/62ERHLjqfqk/download?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8"
//         },
//         "likes": 62,
//         "liked_by_user": false,
//         "current_user_collections": [],
//         "sponsorship": null,
//         "topic_submissions": {},
//         "asset_type": "photo",
//         "user": {
//             "id": "IFcEhJqem0Q",
//             "updated_at": "2024-08-10T11:51:52Z",
//             "username": "anniespratt",
//             "name": "Annie Spratt",
//             "first_name": "Annie",
//             "last_name": "Spratt",
//             "twitter_username": "anniespratt",
//             "portfolio_url": "https://www.anniespratt.com",
//             "bio": "Hobbyist photographer from England, sharing my digital, film + vintage slide scans. Shooting a roll of film every day in 2024.",
//             "location": "New Forest National Park, UK",
//             "links": {
//                 "self": "https://api.unsplash.com/users/anniespratt",
//                 "html": "https://unsplash.com/@anniespratt",
//                 "photos": "https://api.unsplash.com/users/anniespratt/photos",
//                 "likes": "https://api.unsplash.com/users/anniespratt/likes",
//                 "portfolio": "https://api.unsplash.com/users/anniespratt/portfolio",
//                 "following": "https://api.unsplash.com/users/anniespratt/following",
//                 "followers": "https://api.unsplash.com/users/anniespratt/followers"
//             },
//             "profile_image": {
//                 "small": "https://images.unsplash.com/profile-1648828806223-1852f704c58aimage?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=32\u0026h=32",
//                 "medium": "https://images.unsplash.com/profile-1648828806223-1852f704c58aimage?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=64\u0026h=64",
//                 "large": "https://images.unsplash.com/profile-1648828806223-1852f704c58aimage?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=128\u0026h=128"
//             },
//             "instagram_username": "anniespratt",
//             "total_collections": 76,
//             "total_likes": 14508,
//             "total_photos": 24327,
//             "total_promoted_photos": 3098,
//             "total_illustrations": 3,
//             "total_promoted_illustrations": 0,
//             "accepted_tos": true,
//             "for_hire": false,
//             "social": {
//                 "instagram_username": "anniespratt",
//                 "portfolio_url": "https://www.anniespratt.com",
//                 "twitter_username": "anniespratt",
//                 "paypal_email": null
//             }
//         },
//         "exif": {
//             "make": null,
//             "model": null,
//             "name": null,
//             "exposure_time": null,
//             "aperture": null,
//             "focal_length": null,
//             "iso": null
//         },
//         "location": {
//             "name": null,
//             "city": null,
//             "country": null,
//             "position": {
//                 "latitude": 0.0,
//                 "longitude": 0.0
//             }
//         },
//         "views": 343253,
//         "downloads": 8925
//     },
//     {
//         "id": "HkFkMbGk92w",
//         "slug": "a-very-tall-mountain-with-some-clouds-in-the-sky-HkFkMbGk92w",
//         "alternative_slugs": {
//             "en": "a-very-tall-mountain-with-some-clouds-in-the-sky-HkFkMbGk92w",
//             "es": "una-montana-muy-alta-con-algunas-nubes-en-el-cielo-HkFkMbGk92w",
//             "ja": "空に雲が少しある非常に高い山-HkFkMbGk92w",
//             "fr": "une-tres-haute-montagne-avec-quelques-nuages-dans-le-ciel-HkFkMbGk92w",
//             "it": "una-montagna-molto-alta-con-alcune-nuvole-nel-cielo-HkFkMbGk92w",
//             "ko": "하늘에-구름이-있는-매우-높은-산-HkFkMbGk92w",
//             "de": "ein-sehr-hoher-berg-mit-einigen-wolken-am-himmel-HkFkMbGk92w",
//             "pt": "uma-montanha-muito-alta-com-algumas-nuvens-no-ceu-HkFkMbGk92w"
//         },
//         "created_at": "2024-07-25T09:09:34Z",
//         "updated_at": "2024-08-07T23:41:58Z",
//         "promoted_at": "2024-07-31T10:10:11Z",
//         "width": 4000,
//         "height": 6000,
//         "color": "#c0c0d9",
//         "blur_hash": "LZC%z3%M%MRj?wxuofR%R+j@M{t7",
//         "description": null,
//         "alt_description": "A very tall mountain with some clouds in the sky",
//         "breadcrumbs": [],
//         "urls": {
//             "raw": "https://images.unsplash.com/photo-1721897922028-9042704f182f?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3",
//             "full": "https://images.unsplash.com/photo-1721897922028-9042704f182f?crop=entropy\u0026cs=srgb\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=85",
//             "regular": "https://images.unsplash.com/photo-1721897922028-9042704f182f?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=1080",
//             "small": "https://images.unsplash.com/photo-1721897922028-9042704f182f?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=400",
//             "thumb": "https://images.unsplash.com/photo-1721897922028-9042704f182f?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=200",
//             "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1721897922028-9042704f182f"
//         },
//         "links": {
//             "self": "https://api.unsplash.com/photos/a-very-tall-mountain-with-some-clouds-in-the-sky-HkFkMbGk92w",
//             "html": "https://unsplash.com/photos/a-very-tall-mountain-with-some-clouds-in-the-sky-HkFkMbGk92w",
//             "download": "https://unsplash.com/photos/HkFkMbGk92w/download?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8",
//             "download_location": "https://api.unsplash.com/photos/HkFkMbGk92w/download?ixid=M3w2NDIyMDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjMyOTA5MDh8"
//         },
//         "likes": 58,
//         "liked_by_user": false,
//         "current_user_collections": [],
//         "sponsorship": null,
//         "topic_submissions": {
//             "textures-patterns": {
//                 "status": "rejected"
//             },
//             "travel": {
//                 "status": "rejected"
//             },
//             "nature": {
//                 "status": "rejected"
//             },
//             "wallpapers": {
//                 "status": "approved",
//                 "approved_on": "2024-07-29T18:16:37Z"
//             }
//         },
//         "asset_type": "photo",
//         "user": {
//             "id": "guKy0hKA9Xo",
//             "updated_at": "2024-08-10T11:05:39Z",
//             "username": "zorzf",
//             "name": "Zo Razafindramamba",
//             "first_name": "Zo",
//             "last_name": "Razafindramamba",
//             "twitter_username": null,
//             "portfolio_url": null,
//             "bio": null,
//             "location": null,
//             "links": {
//                 "self": "https://api.unsplash.com/users/zorzf",
//                 "html": "https://unsplash.com/@zorzf",
//                 "photos": "https://api.unsplash.com/users/zorzf/photos",
//                 "likes": "https://api.unsplash.com/users/zorzf/likes",
//                 "portfolio": "https://api.unsplash.com/users/zorzf/portfolio",
//                 "following": "https://api.unsplash.com/users/zorzf/following",
//                 "followers": "https://api.unsplash.com/users/zorzf/followers"
//             },
//             "profile_image": {
//                 "small": "https://images.unsplash.com/profile-1719397027494-1e54b77370aaimage?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=32\u0026h=32",
//                 "medium": "https://images.unsplash.com/profile-1719397027494-1e54b77370aaimage?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=64\u0026h=64",
//                 "large": "https://images.unsplash.com/profile-1719397027494-1e54b77370aaimage?ixlib=rb-4.0.3\u0026crop=faces\u0026fit=crop\u0026w=128\u0026h=128"
//             },
//             "instagram_username": "zo.rzf",
//             "total_collections": 0,
//             "total_likes": 138,
//             "total_photos": 62,
//             "total_promoted_photos": 8,
//             "total_illustrations": 0,
//             "total_promoted_illustrations": 0,
//             "accepted_tos": true,
//             "for_hire": false,
//             "social": {
//                 "instagram_username": "zo.rzf",
//                 "portfolio_url": null,
//                 "twitter_username": null,
//                 "paypal_email": null
//             }
//         },
//         "exif": {
//             "make": "FUJIFILM",
//             "model": "X-T2",
//             "name": "FUJIFILM, X-T2",
//             "exposure_time": "1/250",
//             "aperture": "8",
//             "focal_length": "85.0",
//             "iso": 200
//         },
//         "location": {
//             "name": "Dolomites",
//             "city": null,
//             "country": null,
//             "position": {
//                 "latitude": 0.0,
//                 "longitude": 0.0
//             }
//         },
//         "views": 276734,
//         "downloads": 3737
//     }
// ];

const PhotoGrid: React.FC<PhotoGridProps> = ({ customerId }) => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchPhotos = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://api.unsplash.com/photos/random', {
                params: { count: 9 },
                headers: {
                    Authorization: `Client-ID ${UNSPLASH_API_ACCESS_KEY}`,
                },
            });
            setPhotos(response.data.map((photo: any) => ({ url: photo.urls.small })));
        } catch (error) {
            console.error("Error fetching photos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotos();
        const interval = setInterval(fetchPhotos, 10000);
        return () => clearInterval(interval);
    }, [customerId]);

    return (
        <>
            {loading ? (
                <LoadingWrapper>
                    <ClipLoader size={50} color={"#007BFF"} />
                </LoadingWrapper>
            ) : (
                <Grid>
                    {photos.map((photo, index) => (
                        <PhotoContainer key={index}>
                            <PhotoImage src={photo.url} alt={`Photo ${index + 1}`} />
                        </PhotoContainer>
                    ))}
                </Grid>
            )}
        </>
    );
};

export default PhotoGrid;
