﻿using server.Models;
using System.Text.Json.Serialization;

namespace server.ViewModels
{
    public class CardResponse : Response
    {
        public string Username = "";

        public List<Link> Links;
    }
}
