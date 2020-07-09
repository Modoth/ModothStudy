/* 
 * api
 *
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v2.0
 * 
 * Generated by: https://github.com/swagger-api/swagger-codegen.git
 */

using System;
using System.Linq;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.ComponentModel.DataAnnotations;
using SwaggerDateConverter = IO.Swagger.Client.SwaggerDateConverter;

namespace IO.Swagger.Model
{
    /// <summary>
    /// Condition
    /// </summary>
    [DataContract]
    public partial class Condition :  IEquatable<Condition>, IValidatableObject
    {
        /// <summary>
        /// Defines Type
        /// </summary>
        [JsonConverter(typeof(StringEnumConverter))]
        public enum TypeEnum
        {
            
            /// <summary>
            /// Enum None for value: None
            /// </summary>
            [EnumMember(Value = "None")]
            None = 1,
            
            /// <summary>
            /// Enum And for value: And
            /// </summary>
            [EnumMember(Value = "And")]
            And = 2,
            
            /// <summary>
            /// Enum Not for value: Not
            /// </summary>
            [EnumMember(Value = "Not")]
            Not = 3,
            
            /// <summary>
            /// Enum Or for value: Or
            /// </summary>
            [EnumMember(Value = "Or")]
            Or = 4,
            
            /// <summary>
            /// Enum Has for value: Has
            /// </summary>
            [EnumMember(Value = "Has")]
            Has = 5,
            
            /// <summary>
            /// Enum Equal for value: Equal
            /// </summary>
            [EnumMember(Value = "Equal")]
            Equal = 6,
            
            /// <summary>
            /// Enum Contains for value: Contains
            /// </summary>
            [EnumMember(Value = "Contains")]
            Contains = 7,
            
            /// <summary>
            /// Enum StartsWith for value: StartsWith
            /// </summary>
            [EnumMember(Value = "StartsWith")]
            StartsWith = 8,
            
            /// <summary>
            /// Enum EndsWith for value: EndsWith
            /// </summary>
            [EnumMember(Value = "EndsWith")]
            EndsWith = 9,
            
            /// <summary>
            /// Enum GreaterThan for value: GreaterThan
            /// </summary>
            [EnumMember(Value = "GreaterThan")]
            GreaterThan = 10,
            
            /// <summary>
            /// Enum GreaterThanOrEqual for value: GreaterThanOrEqual
            /// </summary>
            [EnumMember(Value = "GreaterThanOrEqual")]
            GreaterThanOrEqual = 11,
            
            /// <summary>
            /// Enum LessThenOrEqual for value: LessThenOrEqual
            /// </summary>
            [EnumMember(Value = "LessThenOrEqual")]
            LessThenOrEqual = 12
        }

        /// <summary>
        /// Gets or Sets Type
        /// </summary>
        [DataMember(Name="type", EmitDefaultValue=false)]
        public TypeEnum? Type { get; set; }
        /// <summary>
        /// Initializes a new instance of the <see cref="Condition" /> class.
        /// </summary>
        /// <param name="type">type.</param>
        /// <param name="prop">prop.</param>
        /// <param name="value">value.</param>
        /// <param name="children">children.</param>
        public Condition(TypeEnum? type = default(TypeEnum?), string prop = default(string), string value = default(string), List<Condition> children = default(List<Condition>))
        {
            this.Type = type;
            this.Prop = prop;
            this.Value = value;
            this.Children = children;
        }
        

        /// <summary>
        /// Gets or Sets Prop
        /// </summary>
        [DataMember(Name="prop", EmitDefaultValue=false)]
        public string Prop { get; set; }

        /// <summary>
        /// Gets or Sets Value
        /// </summary>
        [DataMember(Name="value", EmitDefaultValue=false)]
        public string Value { get; set; }

        /// <summary>
        /// Gets or Sets Children
        /// </summary>
        [DataMember(Name="children", EmitDefaultValue=false)]
        public List<Condition> Children { get; set; }

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class Condition {\n");
            sb.Append("  Type: ").Append(Type).Append("\n");
            sb.Append("  Prop: ").Append(Prop).Append("\n");
            sb.Append("  Value: ").Append(Value).Append("\n");
            sb.Append("  Children: ").Append(Children).Append("\n");
            sb.Append("}\n");
            return sb.ToString();
        }
  
        /// <summary>
        /// Returns the JSON string presentation of the object
        /// </summary>
        /// <returns>JSON string presentation of the object</returns>
        public virtual string ToJson()
        {
            return JsonConvert.SerializeObject(this, Formatting.Indented);
        }

        /// <summary>
        /// Returns true if objects are equal
        /// </summary>
        /// <param name="input">Object to be compared</param>
        /// <returns>Boolean</returns>
        public override bool Equals(object input)
        {
            return this.Equals(input as Condition);
        }

        /// <summary>
        /// Returns true if Condition instances are equal
        /// </summary>
        /// <param name="input">Instance of Condition to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(Condition input)
        {
            if (input == null)
                return false;

            return 
                (
                    this.Type == input.Type ||
                    (this.Type != null &&
                    this.Type.Equals(input.Type))
                ) && 
                (
                    this.Prop == input.Prop ||
                    (this.Prop != null &&
                    this.Prop.Equals(input.Prop))
                ) && 
                (
                    this.Value == input.Value ||
                    (this.Value != null &&
                    this.Value.Equals(input.Value))
                ) && 
                (
                    this.Children == input.Children ||
                    this.Children != null &&
                    this.Children.SequenceEqual(input.Children)
                );
        }

        /// <summary>
        /// Gets the hash code
        /// </summary>
        /// <returns>Hash code</returns>
        public override int GetHashCode()
        {
            unchecked // Overflow is fine, just wrap
            {
                int hashCode = 41;
                if (this.Type != null)
                    hashCode = hashCode * 59 + this.Type.GetHashCode();
                if (this.Prop != null)
                    hashCode = hashCode * 59 + this.Prop.GetHashCode();
                if (this.Value != null)
                    hashCode = hashCode * 59 + this.Value.GetHashCode();
                if (this.Children != null)
                    hashCode = hashCode * 59 + this.Children.GetHashCode();
                return hashCode;
            }
        }

        /// <summary>
        /// To validate all properties of the instance
        /// </summary>
        /// <param name="validationContext">Validation context</param>
        /// <returns>Validation Result</returns>
        IEnumerable<System.ComponentModel.DataAnnotations.ValidationResult> IValidatableObject.Validate(ValidationContext validationContext)
        {
            yield break;
        }
    }

}
